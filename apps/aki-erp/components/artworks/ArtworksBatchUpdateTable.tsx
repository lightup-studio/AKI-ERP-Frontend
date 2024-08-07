import Table from '@components/shared/Table';
import { ArtworkDetail, ArtworkMetadata } from '@data-access/models';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { UseFormRegister } from 'react-hook-form';

interface ArtworksBatchUpdateTableProps {
  data?: ArtworkDetail<ArtworkMetadata>[];
  register: UseFormRegister<any>;
}

const ArtworksBatchUpdateTable: React.FC<ArtworksBatchUpdateTableProps> = ({
  data = [],
  register,
}) => {
  const columns: ColumnDef<ArtworkDetail<ArtworkMetadata>, any>[] = [
    {
      header: '作品名稱',
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.zhName || row.original.enName}</div>
      ),
    },
    {
      header: '作品圖',
      accessorKey: 'displayImageUrl',
      cell: ({ cell }) => (
        <div>
          <DialogTrigger>
            <Button>
              <img src={cell.getValue()} alt="Artwork" loading="lazy" className="h-20" />
            </Button>
            <Popover placement="right">
              <Dialog className="h-[80vh]">
                <img
                  src={cell.getValue()}
                  alt="Artwork"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      ),
    },
    {
      header: '庫存位置',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <input
              type="hidden"
              defaultValue={row.original.id}
              {...register(`artworks.${row.index}.id`)}
            />
            <select
              className="select select-bordered"
              defaultValue={row.original.warehouseId}
              {...register(`artworks.${row.index}.warehouseId`)}
            >
              <option value={0}>A</option>
              <option value={1}>B</option>
              <option value={2}>C</option>
              <option value={3}>D1</option>
              <option value={5}>D2</option>
              <option value={4}>E</option>
            </select>
            <input
              type="text"
              className="input input-bordered ml-2"
              placeholder="自填位置"
              defaultValue={row.original.metadata?.warehouseLocation}
              {...register(`artworks.${row.index}.metadata.warehouseLocation`)}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};

export default ArtworksBatchUpdateTable;
