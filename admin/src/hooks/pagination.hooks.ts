import { useMemo } from "react";

const range = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, idx) => idx + start);
};

interface Props {
  totalPages: number;
  siblingCount: number;
  currentPage: number;
}

export default function usePagination({
  totalPages,
  siblingCount,
  currentPage,
}: Props) {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 6;
    /*
      case 1:
      if the pages is less the currentPage we want to show
    */
    if (totalPageNumbers >= totalPages) return range(1, totalPages);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 3;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    /*
      case 2 no left dots to show but right dots to be shown 
    */

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, "DOTS", totalPages];
    }

    /*
      case 3 no right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);

      return [firstPageIndex, "DOTS", ...rightRange];
    }

    /*
      case 4: both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
}
