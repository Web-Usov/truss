
import { Delete as DeleteIcon, DeleteForever as ClearIcon, MyLocation as AddNodeIcon, Power as ConnectIcon, SaveAlt as SaveIcon, Straighten as CalcIcon, ViewList as DataIcon, ZoomOutMap as MoveIcon } from '@material-ui/icons';
import * as React from 'react';
import { BtnProps } from 'src/components/Btns/btn';
import { MenuBtnProps } from 'src/components/Btns/menuBtn';
import { UIModes } from 'src/utils/UI';
import { IMode } from '../components/UIToolPanel';
import { HEADER, TOOLS } from './actionsList';
const canvasButtons: BtnProps[] = [
    {
        title: "Сохранить в кэш",
        todo: HEADER.CANVAS.SAVE,
        icon: (<SaveIcon />)
    },
    {
        title: "Очистить",
        todo: HEADER.CANVAS.CLEAR,
        icon: (<ClearIcon />)
    }
]
const calcButtons: BtnProps[] = [
    {
        title: "Рассчитать",
        todo: HEADER.CALC.DO,
        icon: (<CalcIcon />)
    },
    {
        title: "Показать результат",
        todo: HEADER.CALC.RESULT,
        icon: (<DataIcon />)
    }
]
export const headerMenu: MenuBtnProps[] = [
    {
        title: "Холст",
        items: canvasButtons
    },
    {
        title: "Расчет",
        items: calcButtons
    }
]

export const toolsButtons: BtnProps[] = [

    {
        title: "Расчет фермы",
        todo: TOOLS.TRUSS.CALC,
        icon: (<CalcIcon />),
        fab: true
    }
]

export const modsButtons: IMode[] = [
    {
        title: "Перемещение",
        mod: UIModes.move,
        icon: (<MoveIcon />)
    },
    {
        title: "Добавить узел",
        mod: UIModes.addNode,
        icon: (<AddNodeIcon />)
    },
    {
        title: "Соединить узлы",
        mod: UIModes.addBeam,
        icon: (<ConnectIcon />)
    },
    {
        title: "Удалить",
        mod: UIModes.delete,
        icon: (<DeleteIcon />)
    }
]


export const actions = { HEADER, TOOLS };
