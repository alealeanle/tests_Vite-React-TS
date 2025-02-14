import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import s from './Dropdown.module.scss';

type Option = {
  value: string;
  label: string;
};

interface DropdownProps {
  options: Option[];
  placeholder: string;
  onChange: (option: Option) => void;
}

const Dropdown = ({
  options,
  placeholder = 'Выберите значение',
  onChange,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={s.dropdown} ref={dropdownRef}>
      <button
        type="button"
        className={s.dropdownToggle}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {selected ? selected.label : placeholder}
        <span className={clsx(s.arrow, { [s.open]: isOpen })}>▼</span>
      </button>
      {isOpen && (
        <ul className={s.dropdownMenu}>
          {options.map(option => (
            <li
              key={option.value}
              className={s.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
