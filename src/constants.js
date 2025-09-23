export const TYPES = {
  FOLDER: "folder",
  NOTE: "note"
}

export const VIEWS = {
  GRID: "grid",
  LIST: "list"
}

export const SORT_BY = {
  TITLE: "title",
  DATE: "date",
  TYPE: "type"
}

export const ORDER = {
  ASC: "asc",
  DESC: "desc"
}

export const NO_TITLE_MESSAGE = "Carpeta sin título";

export const sortElements = (elements, sort, order) => {
  const wayToSort = (a, b) => {
    if (sort === SORT_BY.DATE) {
      return order === ORDER.DESC
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);

    } else if (sort === SORT_BY.TITLE) {
      return order === ORDER.DESC
        ? b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        : a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

    } else if (sort === SORT_BY.TYPE) {
      // Primero comparar por tipo
      const typeComparison = order === ORDER.DESC
        ? b.type.localeCompare(a.type)
        : a.type.localeCompare(b.type);

      // Si son del mismo tipo, comparar por título
      if (typeComparison === 0) {
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      }
      return typeComparison;
    }

    return 0;
  };

  return [...elements].sort(wayToSort);
};
