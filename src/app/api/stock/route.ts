import { NextResponse } from "next/server";

export type Product = {
  id: string;
  date: string;
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
};

export async function GET() {
  const data: Product[] = [
    { id: "1", date: "25-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Misy dot kely", amount: 2507 },
    { id: "2", date: "25-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Display message", amount: 316 },
    { id: "3", date: "25-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "", amount: 316 },
    { id: "4", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "", amount: 568 },
    { id: "5", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "Vente iPhone XS null", amount: 568 },
    { id: "6", date: "23-01-25", designation: "iPhone 8 64", idProduct: "roY46074", comments: "Scrach", amount: 316 },
    { id: "7", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Housing", amount: 2507 },
    { id: "8", date: "28-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Notif bat", amount: 316 },
    { id: "9", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
    { id: "10", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
  ];

  return NextResponse.json(data);
}
