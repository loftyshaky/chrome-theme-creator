'use_strict';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import hexToHsl from 'hex-to-hsl';
import hexToRgb from 'hex-to-rgb';
import * as analytics from 'js/analytics';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as change_val from 'js/change_val';
import * as imgs from 'js/imgs';

configure({ enforceActions: 'observed' });

//--

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    try {
        const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

        if (!color_ok_btn_clicked) {
            const previously_opened_color_pickier = mut.current_color_pickier.el;

            //> try to hide color pickier when clicking outside of color pickier t
            if (previously_opened_color_pickier) { // if current color pickier's current state exsist
                const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(e.target);

                if (clicked_outside_of_color_pickier) {
                    cancel_color_picking();
                }
            }
            //< try to hide color pickier when clicking outside of color pickier t

            //> try to show color pickier when clicking on color_input_vizualization t
            const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

            if (clicked_on_color_input_vizualization) {
                const color_pickier = sb(e.target, '.color_pickier');
                const { family } = e.target.dataset;
                const { i } = e.target.dataset;
                const color_pickier_hidden = !inputs_data.obj[family][i].color_pickier_is_visible;
                const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier === color_pickier;

                if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                    const body_margin_bottom = parseInt(window.getComputedStyle(s('body')).marginBottom);
                    const fieldset_border_width = parseInt(window.getComputedStyle(s('fieldset')).borderWidth);
                    const margin_bottom_of_body_plus_fieldset_border_width = body_margin_bottom + fieldset_border_width;
                    mut.current_color_pickier.el = color_pickier;
                    mut.current_color_pickier.family = family;
                    mut.current_color_pickier.i = i;
                    mut.current_color_pickier.color = inputs_data.obj[family][i].color || inputs_data.obj[family][i].val;
                    const { name } = inputs_data.obj[family][i];

                    show_or_hide_color_pickier(family, i, true);
                    set_color_color_pickier_position(family, i, 'top');

                    const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight - margin_bottom_of_body_plus_fieldset_border_width;

                    if (!color_pickier_is_fully_visible) {
                        set_color_color_pickier_position(family, i, 'bottom');
                    }

                    analytics.send_event('color_pickiers', `showed-${family}-${name}`);
                }
            }
            //< try to show color pickier when clicking on color_input_vizualization t
        }

    } catch (er) {
        err(er, 31);
    }
};

export const show_or_hide_color_pickier = action((family, i, bool) => {
    try {
        mut.current_pickied_color.rgb.a = 1;
        inputs_data.obj[family][i].color_pickier_is_visible = bool;

        if (!bool) {
            inputs_data.obj[family][i].changed_color_once_after_focus = false;
        }

    } catch (er) {
        err(er, 32);
    }
});

export const set_color_color_pickier_position = action((family, i, val) => {
    try {
        inputs_data.obj[family][i].color_pickiers_position = val;

    } catch (er) {
        err(er, 33);
    }
});

export const set_color_input_vizualization_color = action((family, i, color) => {
    try {
        if (family === 'images' || inputs_data.obj[family][i].name === 'icon') {
            inputs_data.obj[family][i].color = color.rgb ? `rgba(${r.values(color.rgb).join(',')})` : color;

        } else {
            inputs_data.obj[family][i].val = color.hex || color;
        }

    } catch (er) {
        err(er, 34);
    }
});

//> accept color when clicking OK t
export const accept_color = (family, i) => {
    try {
        const { hex } = mut.current_pickied_color;
        const { name } = inputs_data.obj[family][i];
        let color;

        if (family === 'images' || name === 'icon') {
            imgs.create_solid_color_image(name, family, hex, mut.current_pickied_color.rgb.a);

            change_val.change_val(family, i, name, null);

        } else if (family === 'colors') {
            color = hexToRgb(hex);

            change_val.change_val(family, i, color, null);

        } else if (family === 'tints') {
            const hsl = hexToHsl(hex);
            const h = hsl[0] / 360;
            const sl = [hsl[1], hsl[2]];
            const sl_final = sl.map(item => (item === 100 ? 1 : Number(`0.${item}`)));
            color = r.prepend(h, sl_final);

            change_val.change_val(family, i, color, null);
        }

        show_or_hide_color_pickier(family, i, false);

        if (family !== 'images') {
            change_val.set_inputs_data_val(family, i, hex);
        }

        mut.current_color_pickier.el = null;

        analytics.send_event('color_pickiers', `accepted_color-${family}-${name}`);

    } catch (er) {
        err(er, 35);
    }
};
//< accept color when clicking OK t

const cancel_color_picking = () => {
    try {
        const any_color_pickier_is_opened = mut.current_color_pickier.el;

        if (any_color_pickier_is_opened) {
            mut.current_color_pickier.el = null;
            const { family } = mut.current_color_pickier;
            const { i } = mut.current_color_pickier;
            const { name } = inputs_data.obj[family][i];

            show_or_hide_color_pickier(mut.current_color_pickier.family, mut.current_color_pickier.i, false);

            set_color_input_vizualization_color(mut.current_color_pickier.family, mut.current_color_pickier.i, mut.current_color_pickier.color);

            analytics.send_event('color_pickiers', `canceled-${family}-${name}`);
        }

    } catch (er) {
        err(er, 181);
    }
};

export const close_or_open_color_pickier_by_keyboard = e => {
    try {
        const { family, i } = mut.current_color_pickier;
        const any_color_pickier_is_opened = mut.current_color_pickier.el;
        const enter_pressed = e.keyCode === 13;
        const esc_pressed = e.keyCode === 27;

        if (enter_pressed && any_color_pickier_is_opened) {
            document.activeElement.blur(); // prevent color_input_vizualization focus
        }

        if (enter_pressed) {
            if (any_color_pickier_is_opened) {
                accept_color(family, i);
            }

        } else if (esc_pressed) {
            cancel_color_picking();
        }

    } catch (er) {
        err(er, 182);
    }
};

export const focus_input_and_select_all_text_in_it = e => {
    try {
        const color_val_inputs = sab(e.target, 'input');
        const number_of_color_val_inputs = color_val_inputs.length;
        const color_pickier_is_in_hex_mode = number_of_color_val_inputs === 1;
        const color_pickier_is_in_rgb_or_hsl_mode = number_of_color_val_inputs === 4 && !color_val_inputs[number_of_color_val_inputs - 1].offsetParent;

        if (color_pickier_is_in_hex_mode || color_pickier_is_in_rgb_or_hsl_mode) {
            focus_input_and_select_all_text_in_it_inner(color_val_inputs[0]);

        } else { // color pickier is in rgba or hsla mode
            focus_input_and_select_all_text_in_it_inner(color_val_inputs[number_of_color_val_inputs - 1]);
        }

    } catch (er) {
        err(er, 183);
    }
};

const focus_input_and_select_all_text_in_it_inner = input => {
    try {
        if (input) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }

    } catch (er) {
        err(er, 184);
    }
};

export const defocus_color_field = () => {
    try {
        document.activeElement.blur();

    } catch (er) {
        err(er, 185);
    }
};

//> varibles
export const mut = {
    current_pickied_color: {
        rgb: {
            a: 1, // alpha
        },
    },
    current_color_pickier: {
        el: null,
        family: '',
        i: '',
        color: '',
    },
};
//< varibles
