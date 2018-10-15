'use strict';

import x from 'x';

import * as color_pickiers from 'js/color_pickiers';

import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Input_block } from 'components/Input_block';
import { Settings } from 'components/Settings';
import { Links } from 'components/Links';
import { Protecting_screen } from 'components/Protecting_screen';

import react from 'react';

export class All extends react.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
    }

    render() {
        return (
            <div className='all'>
                <Header />
                <Work_folder />
                <Fieldset name="theme_metadata">
                    <Input_block name='theme_metadata' />
                </Fieldset>
                <Fieldset name="theme">
                    <Input_block
                        name='images'
                        hr
                    />
                    <Input_block
                        name='colors'
                        hr
                    />
                    <Input_block
                        name='tints'
                        hr
                    />
                    <Input_block
                        name='properties'
                        hr
                    />
                </Fieldset>
                <Protecting_screen />
                <Settings />
                <Links />
            </div>
        );
    }
}