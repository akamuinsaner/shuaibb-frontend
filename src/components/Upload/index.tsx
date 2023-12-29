import React from 'react';

const Upload = ({
    children,
    accept,
    data,
    beforeUpload,
    action,
    disabled = false,
    onChange
}: {
    accept?: string;
    children: JSX.Element;
    data?: (file: File) => { [name: string]: any };
    beforeUpload?: (file) => boolean;
    action?: (data: any) => any;
    disabled?: boolean;
    onChange?: (file: File) => void;
}) => {
    const uploadRef = React.useRef(null); 

    const formatData = (file: File) => {
        const fd = new FormData();
        let finalData: { [name: string]: any } = { file };
        if (data)  finalData = data(file);
        for (const key in finalData) fd.append(key, finalData[key]);
        return fd;
    }

    const fileOnChange = (e) => {
        if (e.target.files && e.target.files.length) {
            const file = e.target.files[0];
            typeof onChange === 'function' && onChange(file)
            e.target.value = null;
            if (typeof beforeUpload === 'function' && !beforeUpload(file)) {
                return;
            }
            if (typeof action === 'function') {
                const finalData = formatData(file);
                action(finalData)
            }
        }
    }

    return <>
        {React.cloneElement(children, {
            ...children.props,
            disabled: disabled,
            onClick: () => {
                if (disabled) return;
                uploadRef.current.click();
                if (typeof children.props.onClick === 'function') {
                    children.props.onClick()
                }
            }
        })}
        <input
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            ref={uploadRef}
            onChange={fileOnChange}
        />
    </>;
}

export default React.memo(Upload);