import { useMemo } from "react"

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount=1,
    currentPage,
    totalPages,
})=>{

    const range = (start, end) => {
        let length = end - start + 1;
        /*
            Create an array of certain length and set the elements within it from
          start value to end value.
        */
        return Array.from({ length }, (_, idx) => idx + start);
      };

    const paginationRange = useMemo(()=>{
        const totalPagesNumbers = siblingCount + 5;

        if(totalPagesNumbers>=totalPages){
            return range(1,totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
      
            return [...leftRange, -1, totalPages];
          }
         
          if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      
            return [1, -1, ...rightRange];
          } 

          if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];
          }
        
    },[totalCount, pageSize, siblingCount, currentPage])

    return paginationRange;
}
