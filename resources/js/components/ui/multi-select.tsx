import { useId } from 'react';
import ReactSelect, { type MultiValue, type StylesConfig } from 'react-select';

export type SelectOption = {
    value: number;
    label: string;
};

type Props = {
    options: SelectOption[];
    value: number[];
    onChange: (ids: number[]) => void;
    placeholder?: string;
    id?: string;
};

const styles: StylesConfig<SelectOption, true> = {
    control: (base, state) => ({
        ...base,
        minHeight: '36px',
        borderRadius: '6px',
        borderColor: state.isFocused ? 'rgb(10 10 10)' : 'rgb(229 229 229)',
        boxShadow: state.isFocused ? '0 0 0 2px rgb(10 10 10)' : 'var(--shadow-xs)',
        backgroundColor: '#fff',
        fontSize: '14px',
        '&:hover': { borderColor: state.isFocused ? 'rgb(10 10 10)' : 'rgb(212 212 212)' },
    }),
    valueContainer: (base) => ({ ...base, padding: '2px 8px', gap: '4px' }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgb(244 244 245)',
        borderRadius: '4px',
        margin: 0,
    }),
    multiValueLabel: (base) => ({ ...base, fontSize: '12px', color: 'rgb(23 23 23)', padding: '2px 4px' }),
    multiValueRemove: (base) => ({
        ...base,
        color: 'rgb(115 115 115)',
        borderRadius: '0 4px 4px 0',
        '&:hover': { backgroundColor: 'rgb(228 228 231)', color: 'rgb(23 23 23)' },
    }),
    input: (base) => ({ ...base, fontSize: '14px', color: 'rgb(23 23 23)' }),
    placeholder: (base) => ({ ...base, fontSize: '14px', color: 'rgb(163 163 163)' }),
    menu: (base) => ({ ...base, borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50 }),
    menuList: (base) => ({ ...base, padding: '4px' }),
    option: (base, state) => ({
        ...base,
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: state.isSelected
            ? 'rgb(23 23 23)'
            : state.isFocused
              ? 'rgb(244 244 245)'
              : 'transparent',
        color: state.isSelected ? '#fff' : 'rgb(23 23 23)',
        cursor: 'pointer',
        '&:active': { backgroundColor: 'rgb(228 228 231)' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, color: 'rgb(163 163 163)', padding: '0 8px' }),
    clearIndicator: (base) => ({ ...base, color: 'rgb(163 163 163)', padding: '0 4px' }),
};

export default function MultiSelect({ options, value, onChange, placeholder = 'Select…', id }: Props) {
    const autoId = useId();
    const selected = options.filter((o) => value.includes(o.value));

    const handleChange = (newValue: MultiValue<SelectOption>) => {
        onChange(newValue.map((o) => o.value));
    };

    return (
        <ReactSelect
            inputId={id ?? autoId}
            instanceId={autoId}
            isMulti
            options={options}
            value={selected}
            onChange={handleChange}
            placeholder={placeholder}
            styles={styles}
            classNamePrefix="rs"
        />
    );
}
