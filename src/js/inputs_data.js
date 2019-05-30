import { observable, action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';

import x from 'x';
import * as options from 'js/options';

const store = new Store();
configure({ enforceActions: 'observed' });

const { color_input_default } = options.ob.theme_vals[store.get('theme')];

export const reset_inputs_data = action(() => {
    try {
        inputs_data.obj = data_obj_default;

        options.load_setting();

    } catch (er) {
        err(er, 45);
    }
});

export const set_inputs_data = action(new_inputs_data => {
    try {
        inputs_data.obj = new_inputs_data;

    } catch (er) {
        err(er, 201);
    }
});

export const inputs_data = observable({
    obj: {
        theme_metadata: {
            version: {
                key: x.unique_id(),
                name: 'version',
                family: 'theme_metadata',
                type: 'textarea',
                val: '',
            },
            icon: {
                key: x.unique_id(),
                name: 'icon',
                family: 'theme_metadata',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            locale: {
                key: x.unique_id(),
                name: 'locale',
                family: 'theme_metadata',
                type: 'select',
                val: '',
                add_help: true,
            },
            name: {
                key: x.unique_id(),
                name: 'name',
                family: 'theme_metadata',
                type: 'textarea',
                val: '',
                add_help: true,
                counter: true,
                char_limit: 45,
            },
            description: {
                key: x.unique_id(),
                name: 'description',
                family: 'theme_metadata',
                type: 'textarea',
                val: '',
                add_help: true,
                counter: true,
                char_limit: 132,
            },
            default_locale: {
                key: x.unique_id(),
                name: 'default_locale',
                family: 'theme_metadata',
                type: 'select',
                val: '',
                add_help: true,
            },
        },
        images: {
            theme_ntp_background: {
                key: x.unique_id(),
                name: 'theme_ntp_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_toolbar: {
                key: x.unique_id(),
                name: 'theme_toolbar',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame: {
                key: x.unique_id(),
                name: 'theme_frame',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame_inactive: {
                key: x.unique_id(),
                name: 'theme_frame_inactive',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame_incognito: {
                key: x.unique_id(),
                name: 'theme_frame_incognito',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame_incognito_inactive: {
                key: x.unique_id(),
                name: 'theme_frame_incognito_inactive',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame_overlay: {
                key: x.unique_id(),
                name: 'theme_frame_overlay',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_frame_overlay_inactive: {
                key: x.unique_id(),
                name: 'theme_frame_overlay_inactive',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_tab_background: {
                key: x.unique_id(),
                name: 'theme_tab_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_tab_background_incognito: {
                key: x.unique_id(),
                name: 'theme_tab_background_incognito',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_window_control_background: {
                key: x.unique_id(),
                name: 'theme_window_control_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            theme_ntp_attribution: {
                key: x.unique_id(),
                name: 'theme_ntp_attribution',
                family: 'images',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
        },
        colors: {
            ntp_background: {
                key: x.unique_id(),
                name: 'ntp_background',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            toolbar: {
                key: x.unique_id(),
                name: 'toolbar',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame: {
                key: x.unique_id(),
                name: 'frame',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_inactive: {
                key: x.unique_id(),
                name: 'frame_inactive',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_incognito: {
                key: x.unique_id(),
                name: 'frame_incognito',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_incognito_inactive: {
                key: x.unique_id(),
                name: 'frame_incognito_inactive',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            bookmark_text: {
                key: x.unique_id(),
                name: 'bookmark_text',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            tab_text: {
                key: x.unique_id(),
                name: 'tab_text',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            tab_background_text: {
                key: x.unique_id(),
                name: 'tab_background_text',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            button_background: {
                key: x.unique_id(),
                name: 'button_background',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            ntp_text: {
                key: x.unique_id(),
                name: 'ntp_text',
                family: 'colors',
                type: 'color',
                val: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
        },
        tints: {
            frame: {
                key: x.unique_id(),
                name: 'frame',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_inactive: {
                key: x.unique_id(),
                name: 'frame_inactive',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_incognito: {
                key: x.unique_id(),
                name: 'frame_incognito',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            frame_incognito_inactive: {
                key: x.unique_id(),
                name: 'frame_incognito_inactive',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            background_tab: {
                key: x.unique_id(),
                name: 'background_tab',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            buttons: {
                key: x.unique_id(),
                name: 'buttons',
                family: 'tints',
                type: 'color',
                val: color_input_default,
                disabled: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
        },
        properties: {
            ntp_background_alignment: {
                key: x.unique_id(),
                name: 'ntp_background_alignment',
                family: 'properties',
                type: 'select',
                val: 'default',
                add_help: true,
            },
            ntp_background_repeat: {
                key: x.unique_id(),
                name: 'ntp_background_repeat',
                family: 'properties',
                type: 'select',
                val: 'default',
                add_help: true,
            },
            ntp_logo_alternate: {
                key: x.unique_id(),
                name: 'ntp_logo_alternate',
                family: 'properties',
                type: 'select',
                val: 'default',
                add_help: true,
            },
        },
        clear_new_tab: {
            clear_new_tab_video: {
                key: x.unique_id(),
                name: 'clear_new_tab_video',
                family: 'clear_new_tab',
                type: 'img_selector',
                val: '',
                highlight_upload_box: false,
                color: color_input_default,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true,
                changed_color_once_after_focus: false,
                add_help: true,
            },
            video_volume: {
                key: x.unique_id(),
                name: 'video_volume',
                family: 'clear_new_tab',
                type: 'select',
                val: 'default',
                add_help: true,
            },
            size: {
                key: x.unique_id(),
                name: 'size',
                family: 'clear_new_tab',
                type: 'select',
                val: 'default',
                add_help: true,
            },
        },
        options: {
            theme: {
                key: x.unique_id(),
                name: 'theme',
                family: 'options',
                type: 'select',
                val: 'default',
            },
            language: {
                key: x.unique_id(),
                name: 'language',
                family: 'options',
                type: 'select',
                val: 'default',
            },
            chrome_exe_paths: {
                key: x.unique_id(),
                name: 'chrome_exe_paths',
                family: 'options',
                type: 'textarea',
                val: '',
                add_help: true,
            },
            chrome_user_data_folders: {
                key: x.unique_id(),
                name: 'chrome_user_data_folders',
                family: 'options',
                type: 'textarea',
                val: '',
                add_help: true,
            },
            custom_folders: {
                key: x.unique_id(),
                name: 'custom_folders',
                family: 'options',
                type: 'textarea',
                val: '',
                add_help: true,
            },
            max_number_of_history_records: {
                key: x.unique_id(),
                name: 'max_number_of_history_records',
                family: 'options',
                type: 'textarea',
                val: '',
                add_help: true,
            },
            locales_whitelist: {
                key: x.unique_id(),
                name: 'locales_whitelist',
                family: 'options',
                type: 'textarea',
                val: '',
                add_help: true,
            },
            show_help: {
                key: x.unique_id(),
                name: 'show_help',
                family: 'options',
                type: 'checkbox',
                val: true,
                add_help: false,
            },
            enable_analytics: {
                key: x.unique_id(),
                name: 'enable_analytics',
                family: 'options',
                type: 'checkbox',
                val: true,
                add_help: false,
            },
            settings_export_import: {
                key: x.unique_id(),
                name: 'settings_export_import',
                family: 'options',
                type: 'settings_export_import',
                add_help: false,
            },
        },
    },
});

const data_obj_default = r.clone(inputs_data.obj);

observable(inputs_data);
