import React from 'react';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import { TextFieldProps, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Chip from '@mui/material/Chip';

type Option = {
    id: number;
    name: string;
    children?: Option[]
}

const reservekey = -1;

const idChildrenMap = (
    list: Option[],
    result: Map<number, Option[]> = new Map([[reservekey, list]])
) => {
    list.map(item => {
        const hasChildren = item.children && item.children.length;
        if (hasChildren) {
            result.set(item.id, item.children);
            idChildrenMap(item.children, result);
        }
    })
    return result
}

const idOptionMap = (list: Option[], result: Map<number, Option> = new Map()) => {
    list.map(item => {
        result.set(item.id, item);
        if (item.children && item.children.length) {
            idOptionMap(item.children, result);
        }
    })
    return result;
}

const collectChildren = (list: Option[]) => {
    list.map(item => {
        const hasChildren = item.children && item.children.length;
        if (hasChildren) {
            list = [...list, ...item.children];
            collectChildren(item.children);
        }
    })
    return list;
}

const idAllChildrenMap = (list: Option[], result: Map<number, Option[]> = new Map()) => {
    list.map(item => {
        const hasChildren = item.children && item.children.length;
        if (hasChildren) {
            const children = collectChildren(item.children);
            result.set(item.id, children);
            idAllChildrenMap(item.children, result);
        } else {
            result.set(item.id, []);
        }
    })
    return result
}

const CascadeSelect = ({
    error,
    helperText,
    required,
    value,
    options,
    size = "small",
    label,
    multiple = false,
    onChange,
}: Partial<TextFieldProps> & {
    value?: any[];
    options: Option[];
    multiple?: boolean;
    changeAtOnce?: boolean;
    onChange?: (value: any) => void;
}) => {
    const eleRef = React.useRef<HTMLElement>(null);
    const [hovering, setHovering] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const [valueList, setValueList] = React.useState<any[]>([]);
    const [multipleValueList, setMultipleValueList] = React.useState<any[]>([]);
    const actualValueList = multiple ? multipleValueList : valueList;
    const actualSetMethod = multiple ? setMultipleValueList : setValueList;

    const childrenMap = idChildrenMap(options);
    const optionMap = idOptionMap(options);
    const allChildrenMap = idAllChildrenMap(options);

    const closeOptions = React.useCallback((valueList?: any) => {
        setAnchorEl(null);
        typeof onChange === 'function' && onChange(valueList || actualValueList);
    }, [multipleValueList, valueList, multiple]);
    React.useEffect(() => {
        document.addEventListener('click', closeOptions);
        return () => {
            document.removeEventListener('click', closeOptions);
        }
    }, [])

    React.useEffect(() => {
        if (!value) value = [];
        actualSetMethod(value);
    }, [value]);




    const onSelect = React.useCallback((o: any, depth: number) => {
        const newValueList = valueList.slice(0, depth);
        setValueList([...newValueList, o.id]);
        const hasChildren = o.children && o.children.length;
        if (!hasChildren) {
            closeOptions([...newValueList, o.id]);

        }
    }, [valueList])




    const renderMultipleCheckbox = React.useCallback((o) => {
        if (!multiple) return null;
        const hasChildren = o.children && o.children.length;
        const acwcIds = allChildrenMap
            .get(o.id)
            .filter(c => !(c.children && c.children.length))
            .map(c => c.id);
        return <Checkbox
            sx={{ padding: '0', marginRight: '5px' }}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
                if (e.target.checked) {
                    if (hasChildren) {
                        setMultipleValueList(Array.from(new Set([...multipleValueList, ...acwcIds])));
                    } else {
                        setMultipleValueList(Array.from(new Set([...multipleValueList, o.id])));
                    }
                } else {
                    if (hasChildren) {
                        setMultipleValueList(multipleValueList.filter(id => !acwcIds.includes(id)));
                    } else {
                        setMultipleValueList(multipleValueList.filter(id => id !== o.id));
                    }
                }
            }}
            checked={multipleValueList.includes(o.id)
                || (acwcIds.length && acwcIds.every(id => multipleValueList.includes(id)))}
            indeterminate={acwcIds.some(id => multipleValueList.includes(id))
                && !acwcIds.every(id => multipleValueList.includes(id))}
        />
    }, [multiple, multipleValueList]);


    const renderCasCades = React.useCallback((id, depth: number) => {
        const renderList = childrenMap.get(id) || [];
        const open = !!renderList.length && !!anchorEl;
        return <Popper
            slot='Paper'
            sx={{ width: '200px', zIndex: 10000, background: '#fff' }}
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            modifiers={[{ name: 'offset', options: { offset: [depth * 200, 0], }, }]}
        >
            <List component={Paper}>
                {renderList.map(o => {
                    const hasChildren = o.children && o.children.length;
                    const isSelected = `${valueList[depth]}` === `${o.id}`;
                    return <ListItem
                        key={o.id}
                        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        selected={isSelected}
                        secondaryAction={hasChildren ? <ArrowRightIcon /> : null}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(o, depth);
                        }}
                    >
                        {renderMultipleCheckbox(o)}
                        <Typography>{o.name}</Typography>
                    </ListItem>
                })}
            </List>
        </Popper>
    }, [options, valueList, anchorEl, multipleValueList]);



    const renderText = React.useCallback(() => {
        return valueList.map(id => optionMap.get(id)['name']).join(' / ');
    }, [options, valueList]);

    const renderValue = React.useCallback(() => {
        if (multiple) {
            return multipleValueList;
        } else {
            return renderText();
        }
    }, [multiple, multipleValueList, valueList, options]);

    return (
        <>
            <Autocomplete
                ref={eleRef}
                options={[]}
                multiple={multiple}
                open={false}
                value={renderValue()}
                renderTags={(value: readonly any[], getTagProps) => {
                    return value.map((id, index) => <Chip
                        size='small'
                        onDelete={() => setMultipleValueList(multipleValueList.filter(m => `${m}` !== `${id}`))}
                        label={optionMap.get(id)['name']}
                        {...getTagProps({ index })}
                    />)
                }}
                onFocus={(e) => setAnchorEl(e.currentTarget)}
                onMouseOver={e => setHovering(true)}
                onMouseLeave={e => setHovering(false)}
                popupIcon={hovering && actualValueList.length
                    ? <CancelIcon onClick={() => actualSetMethod([])} />
                    : <ArrowDropDownIcon onClick={() => setAnchorEl(eleRef.current)} />}
                readOnly
                renderInput={(params) => <TextField
                    {...params}
                    label={label}
                    required={required}
                    onClick={e => e.stopPropagation()}
                    size={size}
                    error={error}
                    helperText={helperText}
                    focused={!!anchorEl}
                />}
            />
            {[reservekey, ...valueList].map(renderCasCades)}
        </>

    )
}

export default React.memo(CascadeSelect);
