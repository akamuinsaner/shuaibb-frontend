import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd';
import styled from '@mui/material/styles/styled';

const reOrder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getListStyle = (isDraggingOver: boolean) => ({
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    ...draggableStyle,
});

const StyledList = styled('ul')({
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    width: '100%'
})

const StyledListItem = styled('li')({
    width: '120px',
    height: '120px',
    display: 'inline-block',
    marginRight: '16px'
})

const StyledImg = styled('img')({
    height: '100%',
    width: '100%',
    objectFit: 'contain',
    objectPositionL: 'center'
})


const SortModal = ({
    open,
    toggleOpen,
    imgList,
    save
}: {
    open: boolean;
    toggleOpen: (open: boolean) => void;
    imgList: string[];
    save: (details: string[]) => void;
}) => {
    const [currentList, setCurrentList] = React.useState<string[]>([]);

    const onDragEnd = React.useCallback((result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = reOrder(
            currentList,
            result.source.index,
            result.destination.index
        );
        setCurrentList(items);
    }, [currentList]);


    React.useEffect(() => {
        setCurrentList(imgList);
    }, [])

    const renderList = React.useCallback(() => {
        return currentList.map((url, index) => (
            <Draggable
                key={url}
                draggableId={url}
                index={index}
            >
                {(provided, snapshot) => (
                    <StyledListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}
                    >
                        <StyledImg src={url} />
                    </StyledListItem>
                )}
            </Draggable>

        ))
    }, [currentList]);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                排序（拖动排序）
            </DialogTitle>
            <DialogContent>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (<StyledList
                            className='whitespace-nowrap w-[32rem] overflow-x-auto'
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {renderList()}
                            {provided.placeholder}
                        </StyledList>)}
                    </Droppable>
                </DragDropContext>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => {
                    toggleOpen(false);
                    setCurrentList(imgList);
                }}>取消</Button>
                <Button variant='contained' onClick={() => {
                    save(currentList);
                    toggleOpen(false);
                }}>保存并下一步</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(SortModal);

