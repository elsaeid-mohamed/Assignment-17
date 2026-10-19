import {
  CreateOptions,
  HydratedDocument,
  Model,
  QueryFilter,
  ProjectionType,
  QueryOptions,
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  // overload 1: document واحد
  async create({
    data,
    options,
  }: {
    data: Partial<T>;
    options?: CreateOptions;
  }): Promise<HydratedDocument<T>>;

  // overload 2: array من الـ documents
  async create({
    data,
    options,
  }: {
    data: Partial<T>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<T>[]>;

  // الـ implementation
  async create({
    data,
    options,
  }: {
    data: Partial<T> | Partial<T>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<T> | HydratedDocument<T>[]> {
    return this.model.create(data as any, options) as any;
  }

  async createOne({
    data,
    options,
  }: {
    data: Partial<T>;
    options?: CreateOptions;
  }): Promise<HydratedDocument<T>> {
    const [doc] = await this.create({ data: [data], options });
    return doc as HydratedDocument<T>;
  }

  async findOne({
    filter,
    select,
    options,
  }: {
    filter?: QueryFilter<T>;
    select?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<HydratedDocument<T> | null> {
    const doc = this.model.findOne(filter ?? {}, select);
    if (options?.lean) doc.lean();
    return doc.exec() as Promise<HydratedDocument<T> | null>;
  }

  async find({
    filter,
    select,
    options,
  }: {
    filter?: QueryFilter<T>;
    select?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<HydratedDocument<T>[]> {
    const doc = this.model.find(filter ?? {}, select);
    if (options?.sort) doc.sort(options.sort);
    if (options?.skip) doc.skip(options.skip);
    if (options?.limit) doc.limit(options.limit);
    return doc.exec() as Promise<HydratedDocument<T>[]>;
  }
}