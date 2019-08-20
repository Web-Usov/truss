import { DeleteForever as ClearIcon, List as ListIcon, SaveAlt as SaveIcon, Straighten as CalcIcon, ViewList as DataIcon } from '@material-ui/icons';
import { BtnProps } from "src/components/Btns/btn";
import { MenuBtnProps } from "src/components/Btns/menuBtn";
import { HEADER } from "./typesList";



export const headerTrussButtons: BtnProps[] = [
    {
        title: "Выбрать вариант",
        todo: HEADER.TRUSS.SELECT,
        icon: ListIcon
    },

]

export const headerCanvasButtons: BtnProps[] = [
    {
        title: "Сохранить в кэш",
        todo: HEADER.CANVAS.SAVE,
        icon: SaveIcon
    },
    {
        title: "Очистить",
        todo: HEADER.CANVAS.CLEAR,
        icon: ClearIcon
    }
]
export const headerCalcButtons: BtnProps[] = [
    {
        title: "Рассчитать",
        todo: HEADER.CALC.DO,
        icon: CalcIcon
    },
    {
        title: "Показать результат",
        todo: HEADER.CALC.RESULT,
        icon: DataIcon
    }
]

export const headerMenu: MenuBtnProps[] = [
    {
        title: "Ферма",
        items: headerTrussButtons
    },
    {
        title: "Холст",
        items: headerCanvasButtons
    },
    {
        title: "Расчет",
        items: headerCalcButtons
    }
]

export default headerMenu