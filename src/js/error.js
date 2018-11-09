import { observable, action, configure } from 'mobx';

import x from 'x';

configure({ enforceActions: 'observed' });

window.err = action((er_obj, er_code, msg, silent, persistent, exit) => {
    if (!er_obj.silent && !silent) {
        const er_msg = x.message(`${er_obj.msg || msg}_er`);
        const er_msg_final = er_msg ? ` ${er_msg}.` : '';

        ob.er_msg = `${x.message('an_error_occured_msg') + er_msg_final}\n${x.message('error_code_label') + (er_obj.er_code || er_code)}\n${x.message('error_type_label') + er_obj.name}\n${x.message('error_msg_label') + er_obj.message}`; // eslint-disable-line max-len

        change_er_state('er_is_visible', true);
        change_er_state('er_is_highlighted', true);

        change_er_persistence(persistent);
        clear_all_timeouts();

        if (!er_obj.persistent && !persistent) {
            run_timeout('er_is_visible', 20000);
        }

        run_timeout('er_is_highlighted', 200);
    }

    if (er_obj.exit || exit) {
        const updated_er_obj = er_obj;
        updated_er_obj.er_code = er_obj.er_code || er_code;
        updated_er_obj.msg = er_obj.msg || msg;
        updated_er_obj.silent = er_obj.silent || silent;
        updated_er_obj.persistent = er_obj.persistent || persistent;
        updated_er_obj.exit = er_obj.exit || exit;

        throw updated_er_obj;

    } else {
        console.error(er_obj.stack); // eslint-disable-line no-console
    }
});

window.t = msg => {
    throw new Error(msg);
};

window.er_obj = msg => new Error(msg);

const run_timeout = (name, delay) => {
    mut[`${name}_timeout`] = window.setTimeout(() => {
        change_er_state(name, false);
    }, delay);
};

export const clear_all_timeouts = () => {
    clearTimeout(mut.er_is_visible_timeout);
    clearTimeout(mut.er_is_highlighted_timeout);
};

export const change_er_state = action((name, bool) => {
    ob[name] = bool;
});


export const set_component_has_er = action(bool => {
    ob.component_has_er = bool;
});

const change_er_persistence = action(persistent => {
    ob.er_is_persistent = persistent || false;
});

//> variables
export const ob = observable({
    component_has_er: false,
    er_is_visible: false,
    er_is_highlighted: false,
    er_is_persistent: false,
    er_msg: '',
});

const mut = {
    er_is_visible_timeout: null,
    er_is_highlighted_timeout: null,
};
//< variables
