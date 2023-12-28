import React from 'react';
import { Form } from './form';

export type SubmitItemProps = {
    children: JSX.Element;
    data?: object | { (values: any): object };
}

export type SubmitItemExtraProps = {
    setOrder?: (o: number) => void;
    submit?: (data?: SubmitItemProps["data"]) => void;
}

export type SubmitItemComponent<T> = React.FunctionComponent<T>

export const Submit: SubmitItemComponent<SubmitItemProps> = ({
    children,
    data
}) => {
    const _this = React.useRef<SubmitItemExtraProps>({ });
    const order = React.useRef<number>(null);

    const _setOrder = (o: number) => order.current = o;

    _this.current = {
        ..._this.current,
        setOrder: _setOrder,
    }

    React.useEffect(() => {
        Form.registerSubmits(_this);
        return () => {

        }
    }, []);
    return React.cloneElement(children, {
        ...children.props,
        onClick: () => {
            _this.current.submit(data);
            if ('onClick' in children.props) {
                children.props.onClick();
            }
        }
    })
}


