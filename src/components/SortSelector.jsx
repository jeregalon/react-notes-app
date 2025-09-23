import { SORT_BY, ORDER } from "../constants";

export default function SortSelector({ onChangeSort, onChangeOrder, sort, order }) {
  
  const handleSortChange = (e) => {
    const newsort = e.target.value;
    onChangeSort(newsort);
  };

  const handleOrderChange = (e) => {
    const neworder = e.target.value;
    onChangeOrder(neworder);
  };

  return (
    <div className="flex items-center gap-2 bg-neutral-800 p-2 rounded-lg">
      {/* Selector de criterio */}
      <select
        value={sort}
        onChange={handleSortChange}
        className="bg-neutral-700 text-white px-3 py-1 rounded-md outline-none cursor-pointer"
      >
        <option value={SORT_BY.TITLE}>Título</option>
        <option value={SORT_BY.DATE}>Fecha</option>
        <option value={SORT_BY.TYPE}>Tipo</option>
      </select>

      {/* Selector de orden */}
      <select
        value={order}
        onChange={handleOrderChange}
        className="bg-neutral-700 text-white px-3 py-1 rounded-md outline-none cursor-pointer"
      >
        <option value={ORDER.ASC}>Ascendente</option>
        <option value={ORDER.DESC}>Descendente</option>
      </select>
    </div>
  );
}
