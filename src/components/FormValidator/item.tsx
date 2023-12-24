import React from 'react';
import { RuleConfig, ruleCheck } from './rules';
import { Form } from './form';
import { TextFieldProps } from '@mui/material';



export type FormItemProps = {
    name: string;
    children: JSX.Element | { (props: Partial<TextFieldProps & { onChange: (value: any) => void }>): JSX.Element };
    rules?: RuleConfig[];
    multiple?: boolean;
}

export type FormItemExtraProps = {
    emitValue? (v: any): void;
    getValue?: () => any;
    setValue?: (v: any) => void;
    setError?: (error: string) => void;
    validate?: (cb: (error: string, value: any) => void) => void;
}

type FormItemComponent<T> = React.FunctionComponent<T>

const valueHelper = (e) => {
    if (e?.target && e?.target?.value !== null) return e.target.value;
    return e;
}

export const FormItem: FormItemComponent<FormItemProps> = ({
    name,
    multiple,
    children,
    rules = [],
}) => {
    const _this = React.useRef<FormItemExtraProps>({ });
    const [value, setValue] = React.useState<any>((multiple ? [] : ''));
    const [error, setError] = React.useState<string>(null);

    const _setError = React.useCallback((error) => {
        setError(error);
    }, []);
    const _setValue = React.useCallback((v) => {
        console.log(name, v)
        setValue((!v && multiple) ? [] : v)
    }, []);
    const _getValue = React.useCallback(() => {
        return value;
    }, [value]);
    const _validate = React.useCallback((cb) => {
        setError(errorCheck(value));
        cb(errorCheck(value), value);
    }, [value]);

    _this.current = {
        ..._this.current,
        setError: _setError,
        setValue: _setValue,
        getValue: _getValue,
        validate: _validate,
    }

    React.useEffect(() => {
        Form.register(name, _this);
        return () => {
            Form.unRegister(name);
        }
    }, []);


    const errorCheck = React.useCallback((value) => {
        if (!rules || !rules.length) return '';
        return ruleCheck(value, rules);
    }, []);


    const valueOnChange = React.useCallback((e: any) => {
        const value = valueHelper(e);
        setError(errorCheck(value));
        setValue(value);
        _this.current.emitValue(value);
    }, []);

    const required = !!rules.find(item => item.required);

    if (typeof children === 'function') {
        const jsx = children({
            value,
            onChange: valueOnChange,
            helperText: error,
            error: !!error,
        });
        return React.cloneElement(jsx, {
            ...jsx.props,
            error: !!error,
            helperText: error,
            required,
            fullWidth: true,
            size: 'small'
        })
    }
    return React.cloneElement(children, {
        ...children.props,
        defaultValue: value,
        value,
        error: !!error,
        helperText: error,
        onChange: valueOnChange,
        required,
        fullWidth: true,
        size: 'small'
    })

}

