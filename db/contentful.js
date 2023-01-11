const contentful = require("contentful");
const renderer = require("@contentful/rich-text-html-renderer");

const isContentfulAsset = (asset) =>
  asset && asset.sys && asset.sys.type === "Asset";
const isContentfulDocument = (document) =>
  document && document.nodeType === "document";

const CONTENTFUL_HOST = "cdn";
const CONTENTFUL_ACCESS_TOKEN = "x1H_KkJo0FWcNtBc2T8Orjr6fFTrdazxPHWseRj1gpc";

const client = contentful.createClient({
  space: "ak8xe9s3emp7",
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  host: `${CONTENTFUL_HOST}.contentful.com`,
});

const entryNames = {
  en: "memberEn",
  mn: "memberMn",
  ja: "memberJp",
};

let data = {
  en: {},
  mn: {},
  ja: {},
};

const fetchMembersByLocale = async (content_type = entryNames["en"]) => {
  try {
    const { items: memberEntries } = await client.getEntries({ content_type });

    const members = memberEntries.map(({ fields: memberEntry }) => {
      const { name, position, joinedAt, facts, img, thumbnail, bio } =
        memberEntry;
      // TODO: change default img, thumbnail urls
      const member = {
        name,
        position,
        joinedAt,
        facts,
        bio: "",
      };

      if (isContentfulDocument(bio)) {
        member.bio = renderer.documentToHtmlString(bio);
      }

      if (isContentfulAsset(img)) {
        member.img = `https:${img.fields.file.url}`;
      }

      if (isContentfulAsset(thumbnail)) {
        member.thumbnail = `https:${thumbnail.fields.file.url}`;
      }
      return member;
    });

    return members;
  } catch (e) {
    return [];
  }
};
const fetchMembers = async () => {
  data.en.members = await fetchMembersByLocale(entryNames["en"]);
  data.mn.members = await fetchMembersByLocale(entryNames["mn"]);
  data.ja.members = await fetchMembersByLocale(entryNames["ja"]);
};

const getContentfulData = async () => {
  try {
    await fetchMembers();

    return data;
  } catch (e) {
    return [];
  }
};

module.exports = getContentfulData;
