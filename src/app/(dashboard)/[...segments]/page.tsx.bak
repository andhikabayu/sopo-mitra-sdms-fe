'use client'

import { notFound } from 'next/navigation'
import { findModuleByPath } from '@/config/modules'
import { getModuleRegistry } from '@/config/module-registry'
import {
  // CoverageAreaPage,
  LocationsPage,
  ModulePage,
  // SalesAssignmentPage,
} from '@/features/modules'
import { TransactionsPage } from '@/features/transactions'

export default function ModuleRoutePage({ params }: { params: { segments: string[] } }) {
  const pathname = `/${params.segments.join('/')}`

  if (pathname === '/master/locations') {
    return <LocationsPage />
  }

  if (pathname === '/transactions') {
    return <TransactionsPage />
  }

  // if (pathname === '/master/coverage-areas') {
  //   return <CoverageAreaPage />
  // }

  // if (pathname === '/master/sales-assignments') {
  //   return <SalesAssignmentPage />
  // }

  const moduleDefinition = findModuleByPath(pathname)
  if (!moduleDefinition) {
    notFound()
  }

  const registry = getModuleRegistry(pathname)
  if (!registry) {
    notFound()
  }

  return <ModulePage registry={registry} />
}
