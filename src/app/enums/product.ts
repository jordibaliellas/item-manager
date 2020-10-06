export enum TypeColumn {
  text = 'text',
  icon = 'icon',
  image = 'image',
}

export interface Column {
  key: string;
  label: string;
  type: TypeColumn;
  labelRow?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc';
  classes?: string;
  rowClasses?: string;
  clickableRow?: boolean;
}

export const ProductColumns: Column[] = [
  {
    key: 'favorite',
    label: 'Favorite',
    type: TypeColumn.icon,
    rowClasses: 'text-yellow-500',
  },
  {
    key: 'title',
    label: 'Title',
    type: TypeColumn.text,
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
    type: TypeColumn.text,
    classes: 'w-1/2',
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    type: TypeColumn.text,
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    type: TypeColumn.text,
    sortable: true,
  },
  {
    key: 'image',
    label: 'Image',
    type: TypeColumn.image,
    labelRow: 'Show image',
    clickableRow: true,
  },
];
