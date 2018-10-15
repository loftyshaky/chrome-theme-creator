import x from 'x';
import { inputs_data } from 'js/inputs_data';

import { observable, action, configure } from "mobx";

configure({ enforceActions: 'observed' });

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

    if (!color_ok_btn_clicked) {
        const previously_opened_color_pickier = mut.current_color_pickier.el;

        //> try to hide color pickier when clicking outside of color pickier t
        if (previously_opened_color_pickier) { // if current color pickier's current state exsist
            const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(e.target);

            if (clicked_outside_of_color_pickier) {
                mut.current_color_pickier.el = null;

                show_or_hide_color_pickier(mut.current_color_pickier.family, mut.current_color_pickier.i, false);

                set_color_input_vizualization_color(mut.current_color_pickier.family, mut.current_color_pickier.i, mut.current_color_pickier.color);
            }
        }
        //< try to hide color pickier when clicking outside of color pickier t

        //> try to show color pickier when clicking on color_input_vizualization t
        const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

        if (clicked_on_color_input_vizualization) {
            const color_pickier = sb(e.target, '.color_pickier');
            const family = e.target.dataset.family;
            const i = e.target.dataset.i;
            const color_pickier_hidden = !inputs_data.obj[family][i].color_pickier_is_visible;
            const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier == color_pickier

            if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                const margin_bottom_of_body_plus_fieldset_border_and_fieldset_w_bottom_filling = parseInt(window.getComputedStyle(s('body')).marginBottom) + parseInt(window.getComputedStyle(s('fieldset')).borderWidth) + 3;
                mut.current_color_pickier.el = color_pickier;
                mut.current_color_pickier.family = family;
                mut.current_color_pickier.i = i;
                mut.current_color_pickier.color = inputs_data.obj[family][i].color_input_vizualization || inputs_data.obj[family][i].val;

                show_or_hide_color_pickier(family, i, true);
                set_color_color_pickier_position(family, i, 'top');

                const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight - margin_bottom_of_body_plus_fieldset_border_and_fieldset_w_bottom_filling;

                if (!color_pickier_is_fully_visible) {
                    set_color_color_pickier_position(family, i, 'bottom');
                }
            }
        }
        //< try to show color pickier when clicking on color_input_vizualization t
    }
};

export const show_or_hide_color_pickier = action((family, i, bool) => {
    inputs_data.obj[family][i].color_pickier_is_visible = bool;
});

export const set_color_color_pickier_position = action((family, i, val) => {
    inputs_data.obj[family][i].color_pickiers_position = val;
});

export const set_color_input_vizualization_color = action((family, i, color) => {
    const color_final = color.hex || color;

    if (family == 'images') {
        inputs_data.obj[family][i].color_input_vizualization = color_final;

    } else {
        inputs_data.obj[family][i].val = color_final;
    }
});

//> accept color when clicking OK t
export const accept_color = (family, i) => {
    show_or_hide_color_pickier(family, i, false);

    mut.current_color_pickier.el = null;
};
//< accept color when clicking OK t

//> varibles t
const mut = {
    current_color_pickier: {
        el: null,
        family: '',
        i: '',
        color: ''
    }
};
//< varibles t