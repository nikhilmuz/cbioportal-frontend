import {initQueryIndicator} from "test/OncoKbMockUtils";
import OncoKB from './OncoKB';
import React from 'react';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import {mskTableSort} from "../msktable/MSKTable";
import {IndicatorQueryResp} from "../../api/generated/OncoKbAPI";

describe('OncoKB', () => {
    before(() => {

    });

    it('properly calculates OncoKB sort values', () => {

        let queryA = initQueryIndicator({
            oncogenic: 'Oncogenic'
        });

        let queryB = initQueryIndicator({
            oncogenic: 'Oncogenic'
        });

        let array:IndicatorQueryResp[] = [queryA, queryB];

        let sortedArray:IndicatorQueryResp[];

        assert.deepEqual(
            OncoKB.sortValue(queryA), OncoKB.sortValue(queryB),
            'Equal Oncogenicity');

        queryA.oncogenic = 'Oncogenic';
        queryB.oncogenic = 'Inconclusive';
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'Oncogenicity test 2');

        queryA.oncogenic = 'Oncogenic';
        queryB.oncogenic = 'Unknown';
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'Oncogenicity test 3');

        queryA.oncogenic = 'Oncogenic';
        queryB.oncogenic = 'Likely Neutral';
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'Oncogenicity test 4');

        queryA.oncogenic = 'Inconclusive';
        queryB.oncogenic = 'Unknown';
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'Oncogenicity test 5');

        queryA.oncogenic = 'Likely Neutral';
        queryB.oncogenic = 'Inconclusive';
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'Oncogenicity test 6');

        queryA = initQueryIndicator({
            oncogenic: 'Unknown',
            vus: true
        });
        queryB = initQueryIndicator({
            oncogenic: 'Unknown',
            vus: false
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'A is VUS, which should have higher score.');

        queryA = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestSensitiveLevel: 'LEVEL_1'
        });
        queryB = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestSensitiveLevel: 'LEVEL_2A'
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'A(LEVEL_1) should be higher than B(LEVEL_2A)');

        queryA = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestResistanceLevel: 'LEVEL_R1'
        });
        queryB = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestResistanceLevel: 'LEVEL_R2'
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'A(LEVEL_R1) should be higher than B(LEVEL_R2)');

        queryA = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestSensitiveLevel: 'LEVEL_2A',
            highestResistanceLevel: ''
        });
        queryB = initQueryIndicator({
            oncogenic: 'Oncogenic',
            highestSensitiveLevel: '',
            highestResistanceLevel: 'LEVEL_R1'
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'A(LEVEL_2A) should be higher than B(LEVEL_R1)');

        queryA = initQueryIndicator({
            oncogenic: 'Oncogenic'
        });
        queryB = initQueryIndicator({
            oncogenic: 'Unknown',
            highestSensitiveLevel: 'LEVEL_2A'
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'The score for Oncogenic variant(A) should always higher than other categories(B) even B has treatments.');

        queryA = initQueryIndicator({
            variantExist: true
        });
        queryB = initQueryIndicator({
            variantExist: false
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'variantExist test 1');

        queryA = initQueryIndicator({
            variantExist: true
        });
        queryB = initQueryIndicator({
            variantExist: false,
            highestSensitiveLevel: 'LEVEL_2A'
        });
        array = [queryB, queryA];
        sortedArray = mskTableSort<IndicatorQueryResp>(array, OncoKB.sortValue, true);
        assert.isAbove(
            sortedArray.indexOf(queryA), sortedArray.indexOf(queryB),
            'variantExist test 2');
    });

    after(() => {

    });
});