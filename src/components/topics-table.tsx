import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Topic } from '@/db/types'
import { treePathToSlug } from '@/lib/url'

type TopicsTableProps = {
  topics: Topic[]
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: 'label',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-start"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'trees',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-center"
        >
          Subtopics
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const topic = row.original
      const trees = topic.trees?.[0]?.children || []
      return <div className="text-center">{trees.length}</div>
    },
    sortingFn: (rowA, rowB) => {
      const aLength = rowA.original.trees?.[0]?.children?.length || 0
      const bLength = rowB.original.trees?.[0]?.children?.length || 0
      return aLength - bLength
    },
  },
  {
    accessorKey: 'lastReferenced',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end text-right"
        >
          Last Referenced
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastReferenced = row.original.lastReferenced
      if (!lastReferenced) return <div className="text-right">Never</div>
      return (
        <div className="text-right">
          {format(new Date(lastReferenced), 'EEE MMM d h:mma')}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const aDate = rowA.original.lastReferenced
      const bDate = rowB.original.lastReferenced
      if (!aDate && !bDate) return 0
      if (!aDate) return 1
      if (!bDate) return -1
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    },
  },
]

export function TopicsTable({ topics }: TopicsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const navigate = useNavigate()

  const table = useReactTable({
    data: topics,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const handleRowClick = (topic: Topic) => {
    navigate(`/trees/${treePathToSlug(topic.name)}`)
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No topics found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
