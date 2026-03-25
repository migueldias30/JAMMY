"use client";

import { useEffect, useState } from "react";
import { createSeedDatabase, loadDatabase, saveDatabase } from "@/lib/database";
import { AppDatabase } from "@/lib/types";

export function useAppDatabase() {
  const [database, setDatabase] = useState<AppDatabase>(createSeedDatabase);

  useEffect(() => {
    setDatabase(loadDatabase());
  }, []);

  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  const resetDatabase = () => {
    setDatabase(createSeedDatabase());
  };

  return {
    database,
    setDatabase,
    resetDatabase,
  };
}
