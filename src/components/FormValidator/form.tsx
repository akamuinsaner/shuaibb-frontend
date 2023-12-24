import React from 'react';
import { FormItemProps, FormItemExtraProps, FormItem } from './item';

type FormProps = {
    initialValues?: { [name: string]: any };
    children: JSX.Element | JSX.Element[];
    onValuesChange?: (prev: any, cur: any) => void;
}

type FormComponent<T> = React.FunctionComponent<T> & {
    clear?: (values?: any) => void;
    register?: (key: string, _this: React.MutableRefObject<FormItemExtraProps>) => void;
    unRegister?: (key: string) => void;
    Item: React.FunctionComponent<FormItemProps>;
    setValues?: (value: { [name: string]: any }) => void;
    getValues?: () => any;
    validates?: (callback: (errors, values) => void) => void;
    useFormData?(): any;
}



const Form: FormComponent<FormProps> = ({
    children,
    initialValues = {},
    onValuesChange
}) => {
    const fieldValues = React.useRef<any>(initialValues || {});

    const fieldsChange = (values: any) => {
        onValuesChange && onValuesChange(fieldValues.current, values);
        fieldValues.current = values;
    }

    let wired = React.useRef<{ [name: string]: React.MutableRefObject<FormItemExtraProps> }>({});


    Form.register = React.useCallback((key: string, _this: React.MutableRefObject<FormItemExtraProps>) => {
        if (key in fieldValues.current) _this.current.setValue(fieldValues.current?.[key]);
        _this.current.emitValue = (value) => fieldsChange({ ...fieldValues.current, [key]: value });
        wired.current[key] = _this;
    }, []);

    Form.unRegister = React.useCallback((key: string) => {
        delete wired.current[key];
        delete fieldValues.current[key];
    }, []);

    Form.getValues = React.useCallback((fields?: string[]) => {
        if (fields && fields.length) {
            return fields.reduce((prev, key) => {
                return wired.current?.[key]
                    ? { ...prev, [key]: wired.current[key].current.getValue() }
                    : { ...prev }
            }, {});
        }
        return Object.entries(wired.current).reduce((prev, [key, _this]) => {
            return { ...prev, [key]: _this.current.getValue() }
        }, {});
    }, []);

    Form.setValues = React.useCallback((values: any) => {
        fieldsChange({ ...fieldValues.current, ...values});
        Object.entries(values).forEach(([key, value]) => {
            wired.current[key]?.current.setValue(value);
        })
    }, []);

    Form.clear = React.useCallback((values) => {
        const newFields = {};
        Object.entries(wired.current).forEach(([key, _this]) => {
            if (key in values) {
                _this.current.setValue(values[key]);
                newFields[key] = values[key];
            } else {
                _this.current.setValue('')
            }
        })
        fieldsChange({ ...fieldValues.current, ...newFields});
    }, []);

    Form.validates = React.useCallback((cb) => {
        let errors = null;
        let values = {}

        Object.entries(wired.current).forEach(([key, _this]) => {
            _this.current.validate((error, value) => {
                if (error) errors = Object.assign({}, errors, { [key]: error });
                values = Object.assign({}, values, { [key]: value });
            })
        })
        cb(errors, values);
    }, []);


    return <>
        {children}
    </>
}

Form.Item = FormItem;


export {
    Form
}