import { Delete as DeleteIcon, MyLocation as AddNodeIcon, Power as ConnectIcon, Straighten as CalcIcon, ZoomOutMap as MoveIcon } from '@material-ui/icons';
import { BtnProps } from "src/components/Btns/btn";
import { UIModes } from "src/utils/UI";
import { IMode } from "../components/UIToolPanel";
import { TOOLS } from "./typesList";

export const toolsButtons: BtnProps[] = [

    {
        title: "Расчет фермы",
        todo: TOOLS.TRUSS.CALC,
        icon: CalcIcon,
        fab: true
    }
]

export const modsButtons: IMode[] = [
    {
        title: "Перемещение",
        mod: UIModes.move,
        icon: MoveIcon
    },
    {
        title: "Добавить узел",
        mod: UIModes.addNode,
        icon: AddNodeIcon
    },
    {
        title: "Соединить узлы",
        mod: UIModes.addBeam,
        icon: ConnectIcon
    },
    {
        title: "Удалить",
        mod: UIModes.delete,
        icon: DeleteIcon
    }
]
