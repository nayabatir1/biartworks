import { Injectable } from '@nestjs/common';
import { paginationDTO } from '../shared/pagination.dto';

@Injectable()
export class UtilService {
  static buildResponse(data: any = null, message = 'Success') {
    return { data, message };
  }

  static paginationProps(args: paginationDTO): any {
    const currentPage = args.page < 1 ? 1 : args.page;
    args.limit = args.limit < 0 ? 10 : args.limit > 500 ? 500 : args.limit;

    const orderBy = {};

    let temp = orderBy;

    // this code will convert 'unit.name' -> {unit:{name: <sortOrder>}}
    const sortByArr = args.sortBy.split('.');
    sortByArr.forEach((k, i) => {
      if (i !== sortByArr.length - 1) temp[k] = {};
      else temp[k] = args.sortOrder;

      temp = temp[k];
    });

    return {
      skip: (currentPage - 1) * args.limit,
      take: +args.limit,
      orderBy,
    };
  }

  static paginate(count: number, args: paginationDTO) {
    const totalDocs = count;
    const totalPages = Math.ceil(totalDocs / args.limit);
    const hasNextPage = args.page < totalPages;
    const hasPrevPage =
      totalPages > 1 && args.page > 1 && args.page <= totalPages;
    const pagination = {
      limit: +args.limit,
      currentPage: +args.page,
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
    return pagination;
  }
}
