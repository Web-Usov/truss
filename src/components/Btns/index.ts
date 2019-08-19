import { Btn } from './btn';
import { MenuBtn } from './menuBtn';
import { ToggleBtn } from './toggleBtn';

export { Btn, ToggleBtn, MenuBtn };

export interface DisabledBtn {
    [i: string]: boolean
}