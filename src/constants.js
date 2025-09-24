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
    // --- Prioridad: fijados primero ---
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Si ambos están fijados -> ordenar por fecha de fijado DESC (más reciente primero)
    if (a.pinned && b.pinned) {
      return new Date(b.datePinned) - new Date(a.datePinned);
    }

    // --- Si ninguno está fijado, aplicar lógica normal ---
    if (sort === SORT_BY.DATE) {
      return order === ORDER.DESC
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);

    } else if (sort === SORT_BY.TITLE) {
      return order === ORDER.DESC
        ? b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        : a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

    } else if (sort === SORT_BY.TYPE) {
      const typeComparison =
        order === ORDER.DESC
          ? b.type.localeCompare(a.type)
          : a.type.localeCompare(b.type);

      if (typeComparison === 0) {
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      }
      return typeComparison;
    }

    return 0;
  };

  return [...elements].sort(wayToSort);
};

export const formatCustomDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  // Obtener inicio de la semana actual (lunes como inicio, se puede ajustar)
  const dayOfWeek = now.getDay(); // 0=Dom, 1=Lun...
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1); // lunes
  startOfWeek.setHours(0, 0, 0, 0);

  if (sameDay) {
    // Hoy → solo hora
    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (date >= startOfWeek) {
    // Esta semana → día corto + hora
    return date.toLocaleString("es-ES", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    // Semana pasada o anterior → como estaba antes
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  }
}


