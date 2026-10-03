"use client"

import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { FormInput } from '@/components/form/form-input'
import { FormTextarea } from '@/components/form/form-textarea'
import { modulesApi } from '../api/modules.api'
import { API_ROUTES } from '@/config/routes'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { moduleQueryKey } from '../hooks/use-module-crud'

export interface OutletDetailModalProps {
  open: boolean
  onClose: () => void
  data: Record<string, any> | null
  showApprovalActions?: boolean
}

function isValidGMapsUrl(url?: string | null): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    return host.includes('google') && (u.pathname.includes('/maps') || u.search.includes('place'))
  } catch (e) {
    return false
  }
}

export default function OutletDetailModal({ open, onClose, data, showApprovalActions }: OutletDetailModalProps) {
  const queryClient = useQueryClient()
  const [outlet, setOutlet] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const parseNumber = (v: any) => {
    if (v === null || v === undefined || v === '') return null
    const n = Number(String(v))
    return Number.isFinite(n) ? n : null
  }

  const getEmbedUrl = (o: Record<string, any> | null) => {
    if (!o) return null
    const lat = parseNumber(o.latitude) ?? null
    const lng = parseNumber(o.longitude) ?? null
    if (lat !== null && lng !== null) {
      return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`
    }
    return null
  }

  useEffect(() => {
    let mounted = true
    async function fetchDetail() {
      if (!open || !data) return
      const id = Number(data.id ?? data.outlet_id)
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const result = await modulesApi.getById(API_ROUTES.outlets.byId(id))
        if (!mounted) return
        setOutlet(result as Record<string, any> ?? null)
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load outlet')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchDetail()
    return () => {
      mounted = false
      setOutlet(null)
    }
  }, [open, data])

  if (!open) return null

  // Footer actions element (fixed, not scrollable)
  const footerActions = outlet ? (
    <div className="flex justify-end gap-2">
      {outlet && outlet.approval === 'Approve' && (
        <Button
          variant="destructive"
          disabled={actionLoading}
          onClick={async () => {
            const id = Number(outlet.id ?? outlet.outlet_id)
            const c = await Swal.fire({ title: 'Deactivate outlet?', text: 'This will delete/deactivate the outlet.', icon: 'warning', showCancelButton: true })
            if (!c.isConfirmed) return
            try {
              setActionLoading(true)
              await modulesApi.remove(API_ROUTES.outlets.byId(id))
              await Swal.fire({ title: 'Deactivated', icon: 'success' })
              queryClient.invalidateQueries({ queryKey: moduleQueryKey('/outlets') })
              onClose()
            } catch (err: any) {
              await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' })
            } finally {
              setActionLoading(false)
            }
          }}
        >
          {actionLoading ? <Spinner /> : 'Deactivate'}
        </Button>
      )}

      {outlet && showApprovalActions && (
        <>
          <Button
            disabled={actionLoading}
            onClick={async () => {
              const id = Number(outlet.id ?? outlet.outlet_id)
              const c = await Swal.fire({ title: 'Approve outlet?', showCancelButton: true, icon: 'question' })
              if (!c.isConfirmed) return
              try {
                setActionLoading(true)
                await modulesApi.approveOutlet(id, 'approve')
                await Swal.fire({ title: 'Approved', icon: 'success' })
                queryClient.invalidateQueries({ queryKey: moduleQueryKey('/outlets') })
                onClose()
              } catch (err: any) {
                await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' })
              } finally {
                setActionLoading(false)
              }
            }}
          >
            {actionLoading ? <Spinner /> : 'Approve'}
          </Button>
          <Button
            variant="destructive"
            disabled={actionLoading}
            onClick={async () => {
              const id = Number(outlet.id ?? outlet.outlet_id)
              const c = await Swal.fire({ title: 'Reject outlet?', showCancelButton: true, icon: 'warning' })
              if (!c.isConfirmed) return
              try {
                setActionLoading(true)
                await modulesApi.approveOutlet(id, 'reject')
                await Swal.fire({ title: 'Rejected', icon: 'success' })
                queryClient.invalidateQueries({ queryKey: moduleQueryKey('/outlets') })
                onClose()
              } catch (err: any) {
                await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' })
              } finally {
                setActionLoading(false)
              }
            }}
          >
            {actionLoading ? <Spinner /> : 'Reject'}
          </Button>
        </>
      )}
    </div>
  ) : null

  return (
    <Modal open={open} onClose={onClose} title={`Outlet: ${outlet?.outlet_name ?? data?.outlet_name ?? ''}`} size="lg" footer={footerActions}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>
        ) : !outlet ? (
          <div className="text-center py-6 text-sm text-muted-foreground">No data</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormInput label="Outlet Name" value={String(outlet.outlet_name ?? '')} disabled />
              <FormInput label="Outlet Type" value={String(outlet.outlet_type ?? '')} disabled />
              <FormInput label="PIC" value={String(outlet.pic_name ?? '')} disabled />
              <FormInput label="Phone" value={String(outlet.phone_number ?? '')} disabled />
              <FormInput label="Sales Area" value={String(outlet.sales_area ?? '')} disabled />
              <FormInput
                label="City / District / Sub-district"
                value={String([outlet.city, outlet.district, outlet.sub_district].filter(Boolean).join(' / '))}
                disabled
              />
              <FormInput label="Latitude" value={String(outlet.latitude ?? '')} disabled />
              <FormInput label="Longitude" value={String(outlet.longitude ?? '')} disabled />
              <div className="sm:col-span-2">
                <FormTextarea label="Address" value={String(outlet.address ?? '')} disabled />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Google Maps</p>
              {getEmbedUrl(outlet) ? (
                <div className="mt-2 h-80 w-full overflow-hidden rounded-md border">
                  <iframe title="Google Maps" src={getEmbedUrl(outlet) as string} className="h-full w-full" />
                </div>
              ) : outlet.gmaps_url ? (
                <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  Preview not available — <a className="underline" href={String(outlet.gmaps_url)} target="_blank" rel="noreferrer">Open in Google Maps</a>
                </div>
              ) : (
                <div className="mt-2 rounded-md border border-muted/30 bg-muted/5 px-4 py-3 text-sm text-muted-foreground">No map available</div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Meta</p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{outlet.status ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approval</p>
                  <p className="font-medium">{outlet.approval ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium">{outlet.createdBy ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-medium">{outlet.createdAt ? new Date(outlet.createdAt).toLocaleString('id-ID') : '-'}</p>
                </div>
              </div>
            </div>

            {Array.isArray(outlet.sales) && outlet.sales.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Assigned Sales</p>
                <ul className="mt-2 space-y-1">
                  {outlet.sales.map((s: any) => (
                    <li key={s.id} className="text-sm">
                      <span className="font-medium">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

    </Modal>
  )
}
