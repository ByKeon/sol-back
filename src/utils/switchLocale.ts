import i18n from '@/i18n';
import { LIST_Lang, type TYPE_Lang } from '@/config/TYPE_Lang';

function updateHtmlPath(nextLang: TYPE_Lang) {
  const { pathname, search, hash } = window.location;
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length > 0 && LIST_Lang.includes(segments[0] as TYPE_Lang)) {
    segments[0] = nextLang;
  } else {
    segments.unshift(nextLang);
  }

  const newPath = '/' + segments.join('/');
  const newUrl = `${newPath}${search}${hash}`;
  window.history.replaceState({}, '', newUrl);
}

function updateHtmlLang(nextLang: TYPE_Lang) {
  let propLang: string = nextLang;

  switch (nextLang) {
    case 'cn':
      propLang = 'zh-Hans';
      break;
    case 'tw':
      propLang = 'zh-Hant';
      break;
  }
  document.documentElement.lang = propLang;
}

async function dynamicLocale(nextLang: TYPE_Lang) {
  if (!i18n.hasResourceBundle(nextLang, 'translation')) {
    const [allData, langData] = await Promise.all([
      import(`@/locales/all.json`).then((m) => m.default),
      import(`@/locales/${nextLang}.json`).then((m) => m.default),
    ]);

    const mergedData = {
      ...allData,
      ...langData,
    };

    i18n.addResourceBundle(nextLang, 'translation', mergedData, true, true);
  }
}

export async function initLocale() {
  const findLang = (i18n.language || 'tw').split('-')[0] as string;
  const nextLang = LIST_Lang.includes(findLang as TYPE_Lang)
    ? (findLang as TYPE_Lang)
    : 'tw';
  if (!i18n.hasResourceBundle(nextLang, 'translation')) {
    await switchLocale(nextLang);
  }
}

export async function switchLocale(nextLang: TYPE_Lang) {
  updateHtmlPath(nextLang);
  updateHtmlLang(nextLang);
  await dynamicLocale(nextLang);
  await i18n.changeLanguage(nextLang);
}
