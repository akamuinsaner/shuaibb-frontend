import React from 'react';

export type RuleConfig = {
    required?: boolean;
    len?: number;
    max?: number;
    min?: number;
    regex?: RegExp;
    msg: string;
}

export const ruleCheck = (value: any, rules: RuleConfig[]): string => {
    for (let i = 0; i < rules.length; i ++) {
        const rule = rules[i];
        if (rule.required) {
            if ((value === null || value === undefined || value === '') || (Array.isArray(value) && !value.length)) {
                return rule.msg;
            }
        }
        if (rule.len && (typeof value === 'string') && value.length !== rule.len) {
            return rule.msg;
        }
        if (rule.max) {
            if (Array.isArray(value) && value.length > rule.max) {
                return rule.msg;
            }
            if (typeof value === 'string' || typeof value === 'number' && !isNaN(Number(value)) && (Number(value) > rule.max)) {
                return rule.msg;
            }
            if (typeof value === 'string' && (value.length > rule.max)) {
                return rule.msg;
            }
        }
        if (rule.min && !isNaN(Number(value)) && Number(value) < rule.min) {
            return rule.msg;
        }
        if (rule.regex && !rule.regex.test(value)) {
            return rule.msg;
        }
    }
    return '';
}
