'use strict';

import * as r from 'ramda';

export const sort_folders = (folders, start_i, number_of_folders, nest_level) => { // folders = all folders; number_of_folders = amount of folders at nest level + children
    const before_range = folders.slice(0, start_i);
    const after_range = folders.slice(start_i + number_of_folders, folders.length);
    const sort_range = folders.slice(start_i, start_i + number_of_folders);
    const sort_range_nested_removed = sort_range.filter(folder => folder.nest_level == nest_level);
    const extracted_folders = extract_nested_folders_from_sort_range({}, sort_range, nest_level);

    let sort_range_sorted = sort_range_nested_removed.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    Object.keys(extracted_folders).forEach(folder_path => {
        const folder_i_to_append_children_to = sort_range_sorted.findIndex(folder => folder.path == folder_path) + 1;

        sort_range_sorted = r.insertAll(folder_i_to_append_children_to, extracted_folders[folder_path], sort_range_sorted);
    });

    return [].concat(before_range, sort_range_sorted, after_range);
};

const extract_nested_folders_from_sort_range = (extracted_folders, sort_range, nest_level) => {
    const nest_start_i = sort_range.findIndex(folder => folder.nest_level > nest_level);
    const nested_folder_found = nest_start_i > -1;

    if (nested_folder_found) {
        const range_parent_path = sort_range[nest_start_i - 1].path;

        sort_range = r.drop(nest_start_i, sort_range);

        const nest_end_i = sort_range.findIndex(folder => folder.nest_level == nest_level);
        const nested_folder_end_found = nest_end_i > -1;

        if (nested_folder_end_found) {
            extracted_folders[range_parent_path] = sort_range.slice(0, nest_end_i);

            sort_range = r.drop(nest_end_i, sort_range);

        } else {
            extracted_folders[range_parent_path] = sort_range;

            sort_range = [];
        }

        return extract_nested_folders_from_sort_range(extracted_folders, sort_range, nest_level);

    } else {
        return extracted_folders;
    }
};