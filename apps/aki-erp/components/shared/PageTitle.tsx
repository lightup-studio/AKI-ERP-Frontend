'use client';

import { useParams, usePathname } from 'next/navigation';

const data: { [key: string]: React.ReactNode } = {
  '/artworks': <>藝術作品 / 庫存</>,
  '/artworks/add': <>藝術作品 / 庫存 / 新增</>,
  '/disabled-artworks': <>藝術作品 / 非庫存</>,
  '/disabled-artworks/add': <>藝術作品 / 非庫存 / 新增</>,
  '/draft-artworks': <>藝術作品 / 草稿</>,
  '/draft-artworks/add': <>藝術作品 / 草稿 / 新增</>,
  '/purchase/orders': <>進銷存 / 進貨單</>,
  '/purchase/orders/add': <>進銷存 / 進貨單 / 新增</>,
  '/purchase/return-orders': <>進銷存 / 進貨退還單</>,
  '/purchase/return-orders/add': <>進銷存 / 進貨退還單 / 新增</>,
  '/transfer/orders': <>進銷存 / 調撥單</>,
  '/transfer/orders/add': <>進銷存 / 調撥單 / 新增</>,
  '/lend/orders': <>進銷存 / 借出單</>,
  '/lend/return-orders': <>進銷存 / 借出歸還單</>,
  '/repair/orders': <>進銷存 / 維修單</>,
  '/repair/return-orders': <>進銷存 / 維修歸還單</>,
  '/shipment/orders': <>進銷存 / 出貨單</>,
  '/shipment/return-orders': <>進銷存 / 退貨單</>,
  '/artists': <>通用資訊 / 藝術家</>,
  '/collector': <>通用資訊 / 藏家</>,
  '/company': <>通用資訊 / 廠商</>,
};

const PageTitle = () => {
  const params = useParams();
  const pathname = usePathname();

  const pathId = params.id ? `/ ${params.id}` : '';
  const lastIndex = pathname.lastIndexOf('/');
  const pathTitle = data[pathId ? pathname.slice(0, lastIndex) : pathname];

  return (
    <>
      {pathTitle} {pathId}
    </>
  );
};

export default PageTitle;
