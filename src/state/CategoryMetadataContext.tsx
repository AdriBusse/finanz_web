"use client";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { CATEGORY_METADATA_QUERY } from "@/graphql/queries/categoryMetadata";
import type { CategoryMetadata } from "@/graphql/types/CategoryMetadata";

type Ctx = {
  colors: CategoryMetadata["colors"];
  icons: CategoryMetadata["icons"];
  getHexByKey: (key?: string | null) => string | null;
  getKeyByHex: (hex?: string | null) => string | null;
  getIconByKeyword: (keyword: string) => string;
  getKeywordByIcon: (icon: string) => string;
  loading: boolean;
  error: string | null;
};

const CategoryMetadataContext = createContext<Ctx | null>(null);

type QueryData = { categoryMetadata: CategoryMetadata };

export function CategoryMetadataProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery<QueryData>(CATEGORY_METADATA_QUERY, {
    fetchPolicy: "cache-first",
  });

  const colors = data?.categoryMetadata.colors ?? [];
  const icons = data?.categoryMetadata.icons ?? [];

  const value = useMemo<Ctx>(() => {
    const getHexByKey = (key?: string | null) => {
      if (!key) return null;
      return colors.find((c) => c.key === key)?.hex ?? null;
    };
    const getKeyByHex = (hex?: string | null) => {
      if (!hex) return null;
      const norm = hex.toLowerCase();
      return colors.find((c) => c.hex.toLowerCase() === norm)?.key ?? null;
    };
    const getIconByKeyword = (keyword: string) => {
      const opt = icons.find((i) => i.keyword === keyword);
      return opt?.icon ?? "📌";
    };
    const getKeywordByIcon = (icon: string) => {
      const opt = icons.find((i) => i.icon === icon);
      return opt?.keyword ?? "other";
    };
    return {
      colors,
      icons,
      getHexByKey,
      getKeyByHex,
      getIconByKeyword,
      getKeywordByIcon,
      loading,
      error: error?.message ?? null,
    };
  }, [colors, icons, loading, error?.message]);

  return (
    <CategoryMetadataContext.Provider value={value}>
      {children}
    </CategoryMetadataContext.Provider>
  );
}

export function useCategoryMetadata() {
  const ctx = useContext(CategoryMetadataContext);
  if (!ctx) throw new Error("useCategoryMetadata must be used within CategoryMetadataProvider");
  return ctx;
}

