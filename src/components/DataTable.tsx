/**
 * Componente de tabla de datos reutilizable
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  createPath?: string;
  createLabel?: string;
  emptyMessage?: string;
  showActions?: boolean;
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
}

/**
 * Componente de skeleton para la tabla
 */
const TableSkeleton: React.FC<{ columns: number; rows?: number }> = ({ 
  columns, 
  rows = 5 
}) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-2">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Componente principal de tabla de datos
 */
const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  onEdit,
  onDelete,
  onView,
  createPath,
  createLabel = "Crear",
  emptyMessage = "No hay datos disponibles",
  showActions = true,
  actions = { edit: true, delete: true, view: true },
}: DataTableProps<T>) => {
  const [filteredData, setFilteredData] = React.useState<T[]>(data);
  const [internalSearchValue, setInternalSearchValue] = React.useState(searchValue);

  React.useEffect(() => {
    if (onSearchChange) {
      const filtered = data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(internalSearchValue.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, internalSearchValue, onSearchChange]);

  const handleSearchChange = (value: string) => {
    setInternalSearchValue(value);
    onSearchChange?.(value);
  };

  const renderCellValue = (column: Column<T>, row: T) => {
    const keyStr = String(column.key);
    const value = keyStr.includes('.') 
      ? keyStr.split('.').reduce((obj, key) => obj?.[key], row)
      : row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row);
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      );
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value || '');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <TableSkeleton columns={columns.length + (showActions ? 1 : 0)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={internalSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
        
        {createPath && (
          <Button asChild>
            <Link to={createPath}>
              <Plus className="h-4 w-4 mr-2" />
              {createLabel}
            </Link>
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.width }}>
                  {column.label}
                </TableHead>
              ))}
              {showActions && <TableHead className="w-32">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (showActions ? 1 : 0)} 
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {actions.view && onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(row)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.edit && onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(row)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.delete && onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(row)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
