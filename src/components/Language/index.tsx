import React from 'react';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import useGlobalStore from 'globalStore';
import { useQuery, useQueries } from '@tanstack/react-query';
import { languages as languagesFn } from 'apis/static';


const formatLanguges = (languages: any) => {
    let resource: any = {};
    Object.entries(languages).map(([key, obj]) => {
        Object.entries(obj).map(([lang, trans]) => {
            if (lang in resource) {
                resource[lang]["translation"][key] = trans;
            } else {
                resource[lang] = { translation: { [key]: trans } };
            }
        })
    })
    return resource;
}


const LanguageProvider = ({ children }: { children: any }) => {
    const { data: languages } = useQuery({ queryKey: ['language'], queryFn: languagesFn })
    const curLang = useGlobalStore(state => state.curLang);
    React.useEffect(() => {
        if (!languages) return
        i18n
        .use(initReactI18next)
        .init({
            resources: formatLanguges(languages),
            lng: curLang,
            interpolation: {
                escapeValue: false // react already safes from xss
            }
        });
    }, [languages, curLang]);
    if (!languages || !curLang) return null;
    return children;
}

export default React.memo(LanguageProvider);
