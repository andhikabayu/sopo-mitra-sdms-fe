// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { FiEdit2, FiPlus, FiEye, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi'
import { Spinner } from '@/components/ui/spinner'
import OutletDetailModal from './outlet-detail-modal'
import FilterDropdown from '@/components/filter/filter-dropdown'
import { useSearchParams } from 'next/navigation'
import type { ModuleRegistryEntry } from '@/config/module-registry'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import Swal from 'sweetalert2'
import { usePermissions } from '@/features/roles'
import { useAuth } from '@/features/auth'
import { parseApiError } from '@/lib/api/error'
import type { ApiError } from '@/types/api'
import { useQueryClient } from '@tanstack/react-query'
import {
  useModuleCreate,
  useModuleDelete,
  useModuleList,
  useModuleUpdate,
  moduleQueryKey,
} from '../hooks/use-module-crud'
import { modulesApi } from '../api/modules.api'
import { ModuleFormModal } from './module-form-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import InventoryAnalyticsCards from '@/features/inventory/components/inventory-analytics-cards'
import dynamic from 'next/dynamic'
const PurchaseOrderDetailModal = dynamic(() => import('@/features/purchase-orders/components/purchase-order-detail-modal'))

export interface ModulePageProps {
  registry: ModuleRegistryEntry
}

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'update'; row: Record<string, unknown> }
  | { type: 'delete'; row: Record<string, unknown> }

export function ModulePage({ registry }: ModulePageProps) {
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [detailRow, setDetailRow] = useState<Record<string, unknown> | null>(null)
  const searchParams = useSearchParams()

  const { canPerform, role } = usePermissions()
  const { user } = useAuth()

  const isOutlets = registry.module.path === '/outlets'
  const isPurchaseOrders = registry.module.path === '/purchase-orders'
  const isInventory = registry.module.path === '/inventory'
  const [page, setPage] = useState<number>(Number(searchParams?.get('page') ?? 1))
  const [perPage, setPerPage] = useState<number>(Number(searchParams?.get('limit') ?? 50))
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const obj: Record<string, any> = {}
    if (!searchParams) return obj
    for (const key of Array.from(searchParams.keys())) {
      if (['offset', 'limit', 'page'].includes(key)) continue
      if ((isOutlets && key === 'approval') || (isPurchaseOrders && key === 'status')) continue
      obj[key] = searchParams.get(key)
    }
    return obj
  })
  const [activeTab, setActiveTab] = useState<string>('All')
  const [inventoryActiveTab, setInventoryActiveTab] = useState<string>('logs')

  const listParams = (isOutlets || isPurchaseOrders)
    ? (() => {
        if (isOutlets) {
          const approvalFilter = activeTab !== 'All' ? filters.approval ?? activeTab : undefined
          return {
            ...(filters ?? {}),
            ...(approvalFilter ? { approval: approvalFilter } : {}),
            limit: perPage,
            offset: (page - 1) * perPage,
          }
        }

        // Purchase Orders use `status` query param (API expects values like `approved`, `pending`, `rejected`)
        if (isPurchaseOrders) {
          const statusFromTab = (() => {
            if (activeTab === 'All') return undefined
            if (filters.status) return filters.status
            if (activeTab === 'Approve') return 'approved'
            if (activeTab === 'Pending') return 'pending'
            if (activeTab === 'Reject') return 'rejected'
            return activeTab.toLowerCase()
          })()

          return {
            ...(filters ?? {}),
            ...(statusFromTab ? { status: statusFromTab } : {}),
            limit: perPage,
            offset: (page - 1) * perPage,
          }
        }

        return {
          ...(filters ?? {}),
          limit: perPage,
          offset: (page - 1) * perPage,
        }
      })()
    : isInventory
      ? {
          ...(role === 'Sales' && user?.id ? { sales_id: Number(user.id) } : {}),
          limit: perPage,
          offset: (page - 1) * perPage,
        }
    : undefined

  const listQuery = useModuleList(registry, listParams)
  const isLoading = listQuery.isLoading
  const listError = listQuery.error
  const anyListQuery: any = listQuery
  const listData = anyListQuery.data
  // @ts-expect-error inventory/outlet list responses can be either raw arrays or paged objects.
  const data = listParams
    ? (Array.isArray(listData)
      ? listData
      : (listData && typeof listData === 'object' && Object.prototype.hasOwnProperty.call(listData, 'items')
        ? listData['items']
        : []))
    : (listData ?? [])
  // @ts-expect-error inventory/outlet list responses can be either raw arrays or paged objects.
  const totalItems = listParams
    ? Number(
        listData && typeof listData === 'object' && Object.prototype.hasOwnProperty.call(listData, 'metadata')
          ? listData['metadata']?.total ?? data.length
          : data.length,
      )
    : data.length
  const createMutation = useModuleCreate(registry)
  const updateMutation = useModuleUpdate(registry)
  const deleteMutation = useModuleDelete(registry)

  const canCreate = canPerform(registry.crud.create)
  const canUpdate = canPerform(registry.crud.update)
  const canDelete = canPerform(registry.crud.delete)
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const isManagerOrSuper = role === 'Super Admin' || role === 'Manager'

  const handleCreate = async (body: Record<string, unknown>) => {
    setFormError(null)
    try {
      await createMutation.mutateAsync(body)
      setModal({ type: 'closed' })
      await Swal.fire({ title: 'Created', text: `${registry.module.title} created.`, icon: 'success' })
    } catch (err) {
      setFormError(parseApiError(err))
    }
  }

  const handleUpdate = async (body: Record<string, unknown>) => {
    if (modal.type !== 'update') return
    setFormError(null)
    try {
      await updateMutation.mutateAsync({ id: Number(modal.row.id), body })
      setModal({ type: 'closed' })
      await Swal.fire({ title: 'Updated', text: `${registry.module.title} updated.`, icon: 'success' })
    } catch (err) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (modal.type !== 'delete') return
    try {
      await deleteMutation.mutateAsync(Number(modal.row.id))
      setModal({ type: 'closed' })
      await Swal.fire({ title: 'Deleted', text: `${registry.module.title} deleted.`, icon: 'success' })
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to delete', icon: 'error' })
    }
  }

  const promptDelete = async (row: Record<string, unknown>) => {
    const label = String(
      row.outlet_name ?? row.name ?? row.supply_no ?? row.return_no ?? row.audit_no ?? row.username ?? row.sku ?? row.id,
    )

    const confirmed = await Swal.fire({
      title: `Delete ${registry.module.title}?`,
      text: `Are you sure you want to delete "${label}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })

    if (!confirmed.isConfirmed) return

    try {
      await deleteMutation.mutateAsync(Number(row.id))
      await Swal.fire({ title: 'Deleted', text: `${registry.module.title} deleted.`, icon: 'success' })
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to delete', icon: 'error' })
    }
  }

  const deleteLabel =
    modal.type === 'delete'
      ? String(
          modal.row.outlet_name ??
            modal.row.name ??
            modal.row.supply_no ??
            modal.row.return_no ??
            modal.row.audit_no ??
            modal.row.username ??
            modal.row.sku ??
            modal.row.id,
        )
      : ''

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{registry.module.endpoint}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{registry.module.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{registry.module.description}</p>
        </div>
        {canCreate && (
          <div className="flex items-center gap-2">
            {isOutlets && (
              <FilterDropdown
                fields={[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'type', label: 'Type', type: 'text' },
                  { key: 'city_id', label: 'City', type: 'select' },
                  { key: 'district_id', label: 'District', type: 'select' },
                  { key: 'sub_district_id', label: 'Sub-district', type: 'select' },
                  { key: 'status', label: 'Status', type: 'boolean' },
                  { key: 'approval', label: 'Approval', type: 'select' },
                ]}
                onApply={(p) => {
                  setFilters(p)
                  setPage(1)
                  setPerPage(Number(p.limit ?? perPage))
                }}
                triggerLabel="Filter"
              />
            )}

            <Button onClick={() => { setFormError(null); setModal({ type: 'create' }) }}>
              <FiPlus className="h-4 w-4" />
              Add {registry.module.title}
            </Button>
          </div>
        )}
      </div>

      {isInventory && (
        <div>
          <InventoryAnalyticsCards />
        </div>
      )}

      {isInventory && (
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">INVENTORY LOGS</h2>
        </div>
      )}

      {(isOutlets || isPurchaseOrders) && (
        <div className="flex items-center gap-2">
              {['All', 'Approve', 'Pending', 'Reject'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t)
                // if selecting All, remove approval/status filter
                if (t === 'All') {
                  const next = { ...(filters ?? {}) }
                  if (isPurchaseOrders) delete next.status
                  else delete next.approval
                  setFilters(next)
                } else {
                  if (isPurchaseOrders) {
                    const mapped = t === 'Approve' ? 'approved' : t === 'Pending' ? 'pending' : t === 'Reject' ? 'rejected' : t.toLowerCase()
                    setFilters({ ...(filters ?? {}), status: mapped })
                  } else {
                    setFilters({ ...(filters ?? {}), approval: t })
                  }
                }
                setPage(1)
              }}
              className={`rounded-md px-3 py-1 text-sm ${activeTab === t ? 'bg-primary text-primary-foreground' : 'bg-muted/10 text-muted-foreground'}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {listError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load data. Please try again.
        </div>
      )}

      <DataTable
        columns={registry.tableColumns}
        data={data as Record<string, unknown>[]}
        isLoading={isLoading}
        searchPlaceholder={`Search ${registry.module.title.toLowerCase()}...`}
        getRowId={(row) => Number(row.id ?? row.outlet_id ?? row.product_id ?? row.sales_id)}
        renderActions={
          registry.module.path === '/outlets'
            ? (row) => (
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDetailRow(row)}
                    aria-label="View"
                  >
                    <FiEye className="h-4 w-4" />
                  </Button>
                  {activeTab === 'All' && canUpdate && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setFormError(null); setModal({ type: 'update', row }) }}
                      aria-label="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {activeTab === 'Approve' && isManagerOrSuper && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={async () => {
                        const id = Number(row.id)
                        const current = Boolean(row.status)
                        const next = !current
                        try {
                          setStatusLoadingId(id)
                          await modulesApi.updateStatus(id, next)
                          await Swal.fire({ title: next ? 'Activated' : 'Deactivated', icon: 'success' })
                          queryClient.invalidateQueries({ queryKey: moduleQueryKey('/outlets') })
                        } catch (err: any) {
                          await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' })
                        } finally {
                          setStatusLoadingId(null)
                        }
                      }}
                      aria-label="Toggle status"
                      disabled={statusLoadingId === Number(row.id)}
                    >
                      {statusLoadingId === Number(row.id) ? (
                        <Spinner />
                      ) : (
                        (row.status === true || row.status === 'true') ? (
                          <FiToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )
                      )}
                    </Button>
                  )}
                </div>
              )
            : (canUpdate || canDelete) ? (row) => {
                // Special-case for Purchase Orders: no edit button; show view and conditional delete only to creator
                if (registry.module.path === '/purchase-orders') {
                  const isOwner = Number(row.sales_id) === Number(user?.id)
                  const isSuper = role === 'Super Admin'
                  const canDeleteRow = (isOwner && canDelete && String(row.status) === 'pending') || (isSuper && canDelete)
                  return (
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => { setFormError(null); setDetailRow(row) }}
                        aria-label="View"
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                      {canDeleteRow && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { setFormError(null); setModal({ type: 'delete', row }) }}
                          aria-label="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                }

                // Default behavior for other modules
                return (
                  <div className="flex justify-end gap-1">
                    {canUpdate && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => { setFormError(null); setModal({ type: 'update', row }) }}
                        aria-label="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      (activeTab === 'Approve' && isManagerOrSuper ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={async () => {
                            const id = Number(row.id)
                            const current = Boolean(row.status)
                            const next = !current
                            try {
                              setStatusLoadingId(id)
                              await modulesApi.updateStatus(id, next)
                              await Swal.fire({ title: next ? 'Activated' : 'Deactivated', icon: 'success' })
                              queryClient.invalidateQueries({ queryKey: moduleQueryKey('/outlets') })
                            } catch (err: any) {
                              await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' })
                            } finally {
                              setStatusLoadingId(null)
                            }
                          }}
                          aria-label="Toggle status"
                          disabled={statusLoadingId === Number(row.id)}
                        >
                          {statusLoadingId === Number(row.id) ? (
                            <Spinner />
                          ) : (
                            (row.status === true || row.status === 'true') ? (
                              <FiToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <FiToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { setFormError(null); setModal({ type: 'delete', row }) }}
                          aria-label="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      ))
                    )}
                  </div>
                )
              }
            : undefined
        }
        serverSide={(isOutlets || isInventory) ? {
          totalItems,
          page,
          perPage,
          onPageChange: (p: number) => setPage(p),
          onPerPageChange: (s: number) => { setPerPage(s); setPage(1) }
        } : undefined}
      />

          {/* Purchase Order detail modal for viewing/approval */}
          {registry.module.path === '/purchase-orders' && (
            // lazy import component to avoid circular deps
            <PurchaseOrderDetailModal open={Boolean(detailRow)} onClose={() => setDetailRow(null)} data={detailRow as any} canApprove={isManagerOrSuper} />
          )}
          {/* Outlet detail modal */}
          {registry.module.path === '/outlets' && (
            <OutletDetailModal open={Boolean(detailRow)} onClose={() => setDetailRow(null)} data={detailRow} showApprovalActions={activeTab === 'Pending'} />
          )}

      {(modal.type === 'create' || modal.type === 'update') && (
        <ModuleFormModal
          open
          onClose={() => setModal({ type: 'closed' })}
          mode={modal.type}
          registry={registry}
          initialData={modal.type === 'update' ? modal.row : undefined}
          onSubmit={modal.type === 'create' ? handleCreate : handleUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={formError}
        />
      )}

      <ConfirmDialog
        open={modal.type === 'delete'}
        onClose={() => setModal({ type: 'closed' })}
        onConfirm={handleDelete}
        title={`Delete ${registry.module.title}`}
        description={`Are you sure you want to delete "${deleteLabel}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </section>
  )
}
