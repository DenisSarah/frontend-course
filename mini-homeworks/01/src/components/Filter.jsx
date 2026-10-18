export function Filter({
  value,
  onChange,
  options,
  selectedValue,
  onSelect,
  optionsLabel,
}) {
  function reset() {
    onChange('');
    onSelect(options[0].value);
  }

  return (
    <div className="filter">
      <label className="filter__label">
        <span>Поиск</span>
        <span className="filter__control">
          <span className="filter__icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Введите запрос"
            autoComplete="off"
          />
        </span>
      </label>
      <label className="filter__option-label">
        <span>{optionsLabel}</span>
        <select value={selectedValue} onChange={(event) => onSelect(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <button
        className="filter__reset"
        type="button"
        onClick={reset}
        disabled={value === '' && selectedValue === options[0].value}
      >
        Сбросить
      </button>
    </div>
  );
}
