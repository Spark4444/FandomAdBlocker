// Map the options to their corresponding element names to delete for better readability and maintainability instead of having a long if statement for each option
const optionsMap = {
    selfPromotionSidebar: [".DiscordChat", ".DiscordIntegratorModule"],
    joinTheConversation: ["#article-discussions"],
    sidebar: [".page__right-rail"],
    bottomNotificationsBanner: [".notifications-placeholder"],
    relatedContentAdsSidebar: [".railModule.rail-module"],
    recentImagesSidebar: [".rail-recentImages-module"],
    cookiesBanner: [".onetrust-pc-dark-filter.ot-fade-in", "#onetrust-banner-sdk"]
};