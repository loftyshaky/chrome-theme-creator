'use_strict';

import { join, sep } from 'path';
import { existsSync, mkdirSync, writeFileSync, removeSync, readdirSync } from 'fs-extra';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as shared from 'js/shared';
import * as settings from 'js/settings';
import * as open_and_pack from 'js/open_and_pack';
import * as tutorial from 'js/tutorial';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as select_folder from 'js/work_folder/select_folder';
import * as choose_folder from 'js/work_folder/choose_folder';

const store = new Store();
configure({ enforceActions: 'observed' });


//--
export const change_val = async (family, i, val, img_extension, e) => {
    try {
        const theme_families = ['theme_metadata', 'images', 'colors', 'tints', 'properties'];

        if (theme_families.indexOf(family) === -1 || choose_folder.reset_work_folder(true)) {
            const new_val = val === 'is_not_select' ? e.target.value : val;
            const { name } = inputs_data.obj[family][i];
            const manifest_path = join(shared.ob.chosen_folder_path, 'manifest.json');
            const default_locale = family === 'theme_metadata' ? shared.find_from_name(inputs_data.obj[family], 'default_locale').val : null;
            const first_if_names = ['name', 'description'];
            const second_if_names = ['version', 'default_locale'];
            const third_if_names = ['colors', 'tints', 'properties'];
            const fourth_if_names = ['images', 'icon'];
            const img_extension_final = `.${img_extension || 'png'}`;

            set_inputs_data_val(family, i, fourth_if_names.indexOf(family) > -1 ? new_val + img_extension_final : new_val);

            if (first_if_names.indexOf(name) > -1) {
                set_name_or_description_prop(name, e.target.value);

                const locale = shared.find_from_name(inputs_data.obj[family], 'locale').val;

                if (name === 'name') {
                    if (locale === default_locale) {
                        new_theme_or_rename.rename_theme_folder(shared.ob.chosen_folder_path, new_val);
                    }
                }

                delete_locale_folder(locale, default_locale, family);

            } else if (second_if_names.indexOf(name) > -1) {
                write_to_json(shared.mut.manifest, manifest_path, name, new_val, 'theme_metadata');

                if (name === 'default_locale') {
                    add_locale_folder(new_val);
                    delete_unused_locale_folders(new_val);
                }

            } else if (name === 'locale') {
                select_folder.get_theme_name_or_descrption_inner(shared.ob.chosen_folder_path, new_val, default_locale);

            } else if (third_if_names.indexOf(family) > -1) {
                write_to_json(shared.mut.manifest, manifest_path, name, new_val, family);

            } else if (fourth_if_names.indexOf(family) > -1) {
                write_to_json(shared.mut.manifest, manifest_path, name, new_val + img_extension_final, family);

                const created_solid_color_background_img = !img_extension && name === 'theme_ntp_background';

                if (created_solid_color_background_img) {
                    set_inputs_data_val('properties', inputs_data.obj.properties.findIndex(item => item.name === 'ntp_background_repeat'), 'repeat');
                    write_to_json(shared.mut.manifest, manifest_path, 'ntp_background_repeat', 'repeat', 'properties');
                }

            } else if (family === 'settings') {
                store.set(name, new_val);

                if (name === 'chrome_user_data_dirs') {
                    open_and_pack.update_chrome_user_data_dirs_observable();

                } else if (name === 'theme') {
                    x.load_css('no_tr');

                    settings.load_theme();

                    await x.delay(200);

                    x.remove(s('.no_tr'));
                }
            }

            if (family === 'images' || third_if_names.indexOf(family) > -1 || name === 'icon') {
                set_default_bool(family, i, false);
            }

            if (family === 'tints') {
                const not_disabling = val.some(item => item > -1);

                if (not_disabling) {
                    set_disabled_bool(family, i, false);
                }
            }
        }

    } catch (er) {
        err(er, 21);
    }
};

const set_name_or_description_prop = (name, new_val, forced_locale) => {
    try {
        const val = shared.mut.manifest[name];
        const val_is_localized = shared.val_is_localized(val);
        const locale = forced_locale || shared.find_from_name(inputs_data.obj.theme_metadata, 'locale').val;
        const messages_path = join(shared.ob.chosen_folder_path, '_locales', locale, 'messages.json');

        check_if_localisation_folders_exists_create_them_if_dont(locale);

        if (val_is_localized) {
            create_messages_file(messages_path);

            const message_name = shared.get_message_name(val);
            const messages = shared.parse_json(messages_path);

            write_to_json(messages, messages_path, message_name, new_val, 'theme_metadata'); // write to messages.json

        } else {
            create_messages_file(messages_path);
            write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'), name, sta.msg_dict[name], 'theme_metadata'); // set message link (__MSG_name__ or __MSG_description__)

            const messages = shared.parse_json(messages_path);

            write_to_json(messages, messages_path, name, new_val, 'theme_metadata'); // write to messages.json
        }

    } catch (er) {
        err(er, 22);
    }
};

const write_to_json = (json, json_path, name, new_val, family) => {
    try {
        const new_json = json;

        if (family === 'theme_metadata') {
            if (name !== 'icon') {
                const writing_at_messages = json_path.indexOf(`${sep}messages.json`) > -1;

                if (writing_at_messages) {
                    new_json[name] = { message: 'message' }; // ex: { "name": {"message": "Theme name" } }
                }

                //> write to messages.json or manifest.json
                if (writing_at_messages) {
                    new_json[name].message = new_val;

                } else {
                    new_json[name] = new_val;
                }
                //< write to messages.json or manifest.json

            } else if (name === 'icon') {
                shared.construct_icons_obj(json);

                new_json.icons['128'] = new_val;
            }

        } else {
            if (!json.theme) {
                new_json.theme = {};
            }

            if (!json.theme[family]) {
                new_json.theme[family] = {};
            }

            new_json.theme[family][name] = name === 'ntp_logo_alternate' ? +new_val : new_val;
        }

        shared.write_to_json(new_json, json_path);

        if (family !== 'theme_metadata' && tutorial.ob.tutorial_stage === 5) {
            tutorial.increment_tutorial_stage();
        }

    } catch (er) {
        err(er, 23);
    }
};

const check_if_localisation_folders_exists_create_them_if_dont = locale => {
    try {
        check_if_folder_exists_create_it_if_dont(join(shared.ob.chosen_folder_path, '_locales'));
        check_if_folder_exists_create_it_if_dont(join(shared.ob.chosen_folder_path, '_locales', locale));

    } catch (er) {
        err(er, 24);
    }
};

const check_if_folder_exists_create_it_if_dont = folder_path => {
    try {
        const folder_exists = existsSync(folder_path);

        if (!folder_exists) {
            mkdirSync(folder_path);
        }

    } catch (er) {
        err(er, 25);
    }
};

const create_messages_file = messages_path => {
    try {
        const messages_file_exist = existsSync(messages_path);

        if (!messages_file_exist) {
            writeFileSync(messages_path, '{}', 'utf8');
        }

    } catch (er) {
        err(er, 26);
    }
};

//> delete locale folder when both name and description is ''
const delete_locale_folder = async (locale, default_locale, family) => {
    try {
        const name = shared.find_from_name(inputs_data.obj[family], 'name').val;
        const description = shared.find_from_name(inputs_data.obj[family], 'description').val;

        if (name === '' && description === '' && locale !== default_locale) {
            try {
                removeSync(join(shared.ob.chosen_folder_path, '_locales', locale));

            } catch (er) {
                err(er, 123, 'locale_is_locked');
            }
        }

    } catch (er) {
        err(er, 122);
    }
};
//< delete locale folder when both name and description is ''

//> delete locale folders with empty name and description
const delete_unused_locale_folders = new_default_locale => {
    try {
        const locale_folders = readdirSync(join(shared.ob.chosen_folder_path, '_locales'));

        locale_folders.forEach(locale_folder => {
            if (locale_folder !== new_default_locale) {
                const messages_path = join(shared.ob.chosen_folder_path, '_locales', locale_folder, 'messages.json');

                const remove_locale_folder = r.ifElse(
                    () => existsSync(messages_path),
                    () => {
                        const messages_json = shared.parse_json(messages_path);

                        const name_exist = check_if_name_or_description_exist('name', messages_json);
                        const description_exist = check_if_name_or_description_exist('name', messages_json);

                        if (!name_exist && !description_exist) {
                            return true;
                        }

                        return false;
                    },
                    () => true,
                )();

                if (remove_locale_folder) {
                    try {
                        removeSync(join(shared.ob.chosen_folder_path, '_locales', locale_folder));

                    } catch (er) {
                        err(er, 131, 'folder_is_locked');
                    }
                }
            }
        });

    } catch (er) {
        err(er, 130);
    }
};
//< delete locale folders with empty name and description

const check_if_name_or_description_exist = (name, message_json) => {
    try {
        const val = shared.mut.manifest[name];
        const val_is_localized = shared.val_is_localized(val);

        if (val_is_localized) {
            const message_name = shared.get_message_name(val);
            if (!message_json) {
                return false;
            }

            if (!message_json[message_name]) {
                return false;

            }

            if (!message_json[message_name].message) {
                return false;

            }

            if (message_json[message_name].message === '') {
                return false;
            }

            return true;
        }

        return false;

    } catch (er) {
        err(er, 132);

        return false;
    }
};

const add_locale_folder = new_default_locale => {
    try {
        set_name_or_description_prop('name', '', new_default_locale);
        set_name_or_description_prop('description', '', new_default_locale);

    } catch (er) {
        err(er, 129, 'folder_is_locked');
    }
};

export const set_inputs_data_val = action((family, i, val) => {
    try {
        inputs_data.obj[family][i].val = val;

    } catch (er) {
        err(er, 27);
    }
});

export const set_inputs_data_color = action((family, i, color) => {
    try {
        inputs_data.obj[family][i].color = color;

    } catch (er) {
        err(er, 28);
    }
});

export const set_default_bool = action((family, i, bool) => {
    try {
        inputs_data.obj[family][i].default = bool;

    } catch (er) {
        err(er, 29);
    }
});

export const set_disabled_bool = action((family, i, bool) => {
    try {
        inputs_data.obj[family][i].disabled = bool;

    } catch (er) {
        err(er, 30);
    }
});

//> variables
const sta = {
    msg_dict: {
        name: '__MSG_name__',
        description: '__MSG_description__',
    },
};
//< variables
