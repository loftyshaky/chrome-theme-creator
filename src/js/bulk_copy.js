import { join, extname } from 'path';
import { existsSync, readdirSync } from 'fs-extra';

import * as r from 'ramda';
import { action, configure, observable, toJS } from 'mobx';
import Store from 'electron-store';
import { remote } from 'electron';

import { inputs_data } from 'js/inputs_data';
import * as json_file from 'js/json_file';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as manifest from 'js/manifest';
import * as picked_colors from 'js/picked_colors';
import * as color_pickiers from 'js/color_pickiers';
import * as history from 'js/history';
import * as imgs from 'js/imgs';
import * as change_val from 'js/change_val';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as set_defaults from 'js/set_defaults';
import * as options from 'js/options';
import * as msg from 'js/msg';
import * as conds from 'js/conds';
import * as confirm from 'js/confirm';
import * as folders from 'js/work_folder/folders';

configure({ enforceActions: 'observed' });
const store = new Store();

set_defaults.set_default_bulk_copy_checkboxes_obj(inputs_data);

export const toggle_checkbox = action((family, name) => {
    try {
        ob.bulk_copy_checkboxes[family][name] = !ob.bulk_copy_checkboxes[family][name];

    } catch (er) {
        err(er, 253);
    }
});

export const select_or_deselect_all_global = action(bool => {
    try {
        Object.keys(inputs_data.obj).forEach(family => {
            if (family !== 'options') {
                select_or_deselect_all_family(family, bool);
            }
        });

    } catch (er) {
        err(er, 254);
    }
});

export const select_or_deselect_all_family = action((family, bool) => {
    try {
        Object.values(inputs_data.obj[family]).forEach(item => {
            ob.bulk_copy_checkboxes[family][item.name] = bool;
        });

    } catch (er) {
        err(er, 255);
    }
});

export const show_or_hide_bulk_copy = action(bool => {
    try {
        if (bool) {
            folders.check_if_selected_folder_is_theme(() => {
                folders.check_if_multiple_themes_is_selected(false, () => {
                    ob.bulk_copy_is_visible = bool;
                });
            });

        } else {
            ob.bulk_copy_is_visible = bool;
        }

        activate_or_deactivate_set_default_mode(false);

    } catch (er) {
        err(er, 256);
    }
});

const activate_or_deactivate_set_default_mode = action(bool => {
    try {
        ob.set_default_mode_is_activated = bool;

    } catch (er) {
        err(er, 268);
    }
});

export const toggle_set_default_mode = () => {
    try {
        activate_or_deactivate_set_default_mode(!ob.set_default_mode_is_activated);

    } catch (er) {
        err(er, 271);
    }
};

export const select_default = action(() => {
    try {
        ob.bulk_copy_checkboxes = store.get('default_bulk_copy_checkboxes');

    } catch (er) {
        err(er, 269);
    }
});

export const accept = () => {
    try {
        const theme_paths = chosen_folder_path.exclude_non_themes();

        if (ob.set_default_mode_is_activated) {
            activate_or_deactivate_set_default_mode(false);

            store.set('default_bulk_copy_checkboxes', toJS(ob.bulk_copy_checkboxes));

        } else if (theme_paths.length > chosen_folder_path.mut.confirm_breakpoint) {
            const dialog_options = confirm.generate_confirm_options('bulk_copy_confirm_msg', 'bulk_copy_confirm_answer_copy');

            const choice = remote.dialog.showMessageBox(confirm.con.win, dialog_options);

            if (choice === 0) {
                bulk_copy(theme_paths);
                show_or_hide_bulk_copy(false);
            }

        } else {
            bulk_copy(theme_paths);
            show_or_hide_bulk_copy(false);
        }

    } catch (er) {
        err(er, 257);
    }
};

export const bulk_copy = theme_paths => {
    try {
        const src_manifest_obj = manifest.mut.manifest;
        const src_messages_obj = get_messages_obj(chosen_folder_path.ob.chosen_folder_path);
        const src_picked_colors_obj = picked_colors.get_picked_colors_obj();

        theme_paths.forEach(target_path => {
            if (target_path !== chosen_folder_path.ob.chosen_folder_path) {
                const target_manifest_path = join(target_path, 'manifest.json');
                const target_messages_obj = get_messages_obj(target_path);
                const target_manifest_obj = json_file.parse_json(target_manifest_path);
                const target_picked_colors_obj = picked_colors.get_picked_colors_obj(target_path);
                const theme_folder = readdirSync(target_path);
                const clear_new_tab_video_is_in_theme_folder = theme_folder.some(file => file === 'clear_new_tab_video.');

                Object.keys(inputs_data.obj).forEach(family => {
                    if (family !== 'options') {
                        Object.values(inputs_data.obj[family]).forEach(({ name }) => {
                            const bulk_copy_checkbox_is_checked = ob.bulk_copy_checkboxes[family][name];

                            if (bulk_copy_checkbox_is_checked) {
                                const is_color = conds.colors(family);
                                const is_textarea = conds.textareas(family, name);
                                const is_select = conds.selects(family, name);
                                const is_select_default = inputs_data.obj[family][name].val === 'default';
                                const src_is_default = is_select ? is_select_default : inputs_data.obj[family][name].default;
                                const src_picked_colors_obj_has_picked_colors_record = picked_colors.check_if_property_exists_on_picked_colors_obj(family, name, src_picked_colors_obj);
                                const src_rgba_color = get_rgba_color(family, name, src_manifest_obj, src_picked_colors_obj, src_is_default, src_picked_colors_obj_has_picked_colors_record, is_textarea, is_select);
                                const img_is_default = name === 'icon' ? false : !target_manifest_obj.theme || !target_manifest_obj.theme[family] || r.isNil(target_manifest_obj.theme[family][name]);
                                const target_is_default = name === 'clear_new_tab_video' ? clear_new_tab_video_is_in_theme_folder : img_is_default;
                                const target_picked_colors_obj_has_picked_colors_record = picked_colors.check_if_property_exists_on_picked_colors_obj(family, name, target_picked_colors_obj);
                                const target_rgba_color = get_rgba_color(family, name, target_manifest_obj, target_picked_colors_obj, target_is_default, target_picked_colors_obj_has_picked_colors_record, is_textarea, is_select);
                                let src_is_disabled = false;
                                let target_is_disabled = false;
                                let src_hsl_string = null;
                                let src_hsl_arr = null;
                                let target_hsl_string = null;
                                let target_hsl_arr = null;
                                let src_color_string = null;
                                let src_color_arr = null;
                                let target_color_string = null;
                                let target_color_arr = null;
                                let src_select_val = null;
                                let target_select_val = null;
                                let src_messages_key = null;
                                let target_messages_key = null;
                                let src_textarea_val = null;
                                let target_textarea_val = null;

                                if (family === 'tints') {
                                    src_hsl_arr = src_is_default ? null : src_manifest_obj.theme[family][name];
                                    target_hsl_arr = target_is_default ? color_pickiers.convert_rgba_strings_to_tint_val(options.ob.theme_vals[options.ob.theme].color_input_default) : target_manifest_obj.theme[family][name];
                                    target_is_disabled = check_if_disabled(target_hsl_arr);

                                    if (target_is_disabled) {
                                        target_hsl_arr = color_pickiers.convert_rgba_strings_to_tint_val(options.ob.theme_vals[options.ob.theme].color_input_disabled);
                                    }

                                    src_hsl_string = src_is_default ? null : color_pickiers.convert_hsl_arr_to_hsl_string(src_hsl_arr);
                                    target_hsl_string = color_pickiers.convert_hsl_arr_to_hsl_string(target_hsl_arr);

                                } else if (is_select) {
                                    if (name === 'default_locale') {
                                        src_select_val = src_manifest_obj[name] || 'en';
                                        target_select_val = target_manifest_obj[name] || 'en';

                                    } else {
                                        src_select_val = src_is_default ? 'default' : src_manifest_obj.theme[family][name];
                                        target_select_val = target_is_default ? 'default' : target_manifest_obj.theme[family][name];
                                    }

                                } else if (is_textarea) {
                                    if (name === 'version') {
                                        src_textarea_val = src_manifest_obj[name];
                                        target_textarea_val = target_manifest_obj[name];

                                    } else {
                                        src_messages_key = msg.get_message_name(src_manifest_obj[name]);
                                        target_messages_key = msg.get_message_name(target_manifest_obj[name]);
                                    }
                                }

                                if (family === 'tints') {
                                    src_color_string = src_hsl_string;
                                    src_color_arr = src_hsl_arr;
                                    target_color_string = target_hsl_string;
                                    target_color_arr = target_hsl_arr;
                                }

                                if (family === 'images' || name === 'clear_new_tab_video' || family === 'colors') {
                                    src_color_string = src_rgba_color.string;
                                    src_color_arr = src_rgba_color.arr;
                                    target_color_string = target_rgba_color.string;
                                    target_color_arr = target_rgba_color.arr;
                                }

                                if (is_color) {
                                    src_is_disabled = check_if_disabled(src_hsl_arr);
                                }

                                const same_colors = src_color_string === target_color_string;
                                const same_select_vals = src_select_val === target_select_val;
                                let special_checkbox;

                                if (is_select) {
                                    special_checkbox = 'select';

                                } else if (src_is_disabled) {
                                    special_checkbox = 'disabled';

                                } else if (!src_is_disabled) {
                                    special_checkbox = 'default';
                                }

                                const record_select_change = set_to_default => history.record_change(() => history.generate_select_history_obj(family, name, name === 'default_locale' ? false : target_is_default, target_select_val, src_select_val, set_to_default), target_path);

                                const change_textarea_val = (locale, default_locale) => {
                                    if (src_textarea_val !== target_textarea_val) {
                                        change_val.change_val(family, name, src_textarea_val, null, false, target_path, locale, default_locale);

                                        history.record_change(() => history.generate_textarea_history_obj(family, name, target_textarea_val, src_textarea_val, locale), target_path);
                                    }
                                };

                                if (!src_is_default && !src_is_disabled) {
                                    if ((family === 'images' || name === 'clear_new_tab_video') && (!same_colors || (!src_color_string && !target_color_string))) {
                                        if (name !== 'theme_ntp_background' && name !== 'icon' && name !== 'clear_new_tab_video') {
                                            history.record_change(() => history.generate_img_history_obj(family, name, target_is_default, src_color_arr, false, target_path), target_path);
                                        }

                                        const new_image_name = folders.find_file_with_exist(name); // ex: toolbar.png
                                        const img_extension = extname(new_image_name); // .png

                                        imgs.remove_img_by_name(new_image_name, target_path); // remove old image from target theme

                                        imgs.copy_img(name, img_extension, join(chosen_folder_path.ob.chosen_folder_path, new_image_name), target_path); // copy image from source theme to target theme on place of removed image in previous line
                                        if (name !== 'clear_new_tab_video') {
                                            change_val.change_val(family, name, name, img_extension, false, target_path);
                                        }

                                    } else if (is_color && !same_colors) {
                                        change_val.change_val(family, name, src_color_arr, null, false, target_path);

                                        history.record_change(() => history.generate_color_history_obj(family, name, target_is_default, false, target_color_string, target_color_arr, src_color_string, false, false, target_path), target_path);

                                    } else if (is_select && !same_select_vals) {
                                        record_select_change(false);

                                        change_val.change_val(family, name, src_select_val, null, false, target_path);

                                    } else if (is_textarea) {
                                        if (name === 'version') {
                                            src_textarea_val = src_manifest_obj[name];
                                            target_textarea_val = target_manifest_obj[name];

                                            change_textarea_val();

                                        } else {
                                            Object.keys(src_messages_obj).forEach(locale => {
                                                src_textarea_val = src_messages_obj[locale] && src_messages_obj[locale][src_messages_key] ? src_messages_obj[locale][src_messages_key].message : null;
                                                target_textarea_val = target_messages_obj[locale] && target_messages_obj[locale][target_messages_key] ? target_messages_obj[locale][target_messages_key].message : null;

                                                change_textarea_val(locale, target_manifest_obj.default_locale);
                                            });
                                        }
                                    }
                                }

                                if ((family === 'images' || family === 'colors')) {
                                    let color;

                                    if (family === 'colors' && !src_is_default) {
                                        color = color_pickiers.convert_rgba_arr_into_obj(src_rgba_color.arr);
                                    }

                                    picked_colors.record_picked_color(family, name, src_rgba_color.obj || color, target_path); //> record picked color from src picked_colors.json to target picked_colors.json file

                                    if (src_is_default) {
                                        picked_colors.remove_picked_color(family, name, target_path); // remove picked color from target picked_colors.json file
                                    }
                                }

                                if (((special_checkbox === 'default' || special_checkbox === 'select') && src_is_default && !target_is_default) || (special_checkbox === 'disabled' && src_is_disabled && !target_is_disabled)) {
                                    if (is_select) {
                                        record_select_change(true);
                                    }

                                    if (name !== 'icon') {
                                        set_default_or_disabled.set_default_or_disabled(
                                            family,
                                            name,
                                            special_checkbox,
                                            true,
                                            target_is_default,
                                            target_is_disabled,
                                            target_color_string,
                                            target_color_arr,
                                            target_path,
                                            target_manifest_obj,
                                        );

                                    } else {
                                        set_default_or_disabled.set_default_icon(family, name, target_path);
                                    }
                                }

                            }
                        });
                    }
                });
            }
        });

    } catch (er) {
        err(er, 280);
    }
};

const check_if_disabled = hsl_arr => {
    try {
        return hsl_arr ? hsl_arr.every(val => val === -1) : false;

    } catch (er) {
        err(er, 277);
    }

    return undefined;
};

const get_messages_obj = theme_path => {
    try {
        const locales_folder_path = join(theme_path, '_locales');
        const messages_obj = {};

        if (existsSync(locales_folder_path)) {
            const locales_folder_files = readdirSync(locales_folder_path);

            for (const locale of locales_folder_files) {
                messages_obj[locale] = {};
                const messages_path = join(locales_folder_path, locale, 'messages.json');

                if (existsSync(messages_path)) {
                    messages_obj[locale] = json_file.parse_json(messages_path);
                }
            }
        }

        return messages_obj;

    } catch (er) {
        err(er, 278);
    }

    return undefined;
};

const get_rgba_color = (family, name, manifest_obj, picked_colors_obj, is_default, picked_colors_obj_has_picked_colors_record, is_textarea, is_select) => {
    try {
        if (!is_textarea && !is_select && family !== 'tints') {
            const rgba_obj = picked_colors_obj_has_picked_colors_record ? picked_colors_obj[family][name] : null;
            let manifest_rgba_arr = null;
            let rgba_string_from_manifest = null;

            if (family !== 'images' && name !== 'icon' && name !== 'clear_new_tab_video') {
                manifest_rgba_arr = is_default ? null : manifest_obj.theme[family][name];
                rgba_string_from_manifest = manifest_rgba_arr ? color_pickiers.convert_rgba_arr_into_string(manifest_rgba_arr) : null;
            }

            const rgba_string_from_rgba_obj = rgba_obj ? color_pickiers.stringify_unpacked_rgba(rgba_obj) : null;
            const rgba_arr_from_rgba_obj = rgba_obj ? color_pickiers.convert_rgba_string_into_rgb_arr(rgba_string_from_rgba_obj) : null;
            const rgba_string = rgba_string_from_rgba_obj || rgba_string_from_manifest;
            const rgba_arr = rgba_arr_from_rgba_obj || manifest_rgba_arr;

            return {
                obj: rgba_obj,
                string: rgba_string,
                arr: rgba_arr,
            };
        }

    } catch (er) {
        err(er, 287);
    }

    return undefined;
};

export const ob = observable({
    bulk_copy_is_visible: false,
    bulk_copy_checkboxes: store.get('default_bulk_copy_checkboxes'),
    set_default_mode_is_activated: false,
});