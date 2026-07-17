"use server";

import { getAllGigs } from "@/lib/pow";

export async function fetchAllGigsAction() {
  return getAllGigs();
}
