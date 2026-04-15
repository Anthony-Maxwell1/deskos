// utils/themeClasses.ts
export type ClassKey = "Tile" | "TileOuter" | "TileOuterNoTopBar";

export type Theme = {
    classes: Record<ClassKey, string>;
    TopBar?: string;
    extraHtml?: string;
    Data?: Record<string, any>;
};

export type ThemeKey = "basic-minimal" | "retro" | "retro-mac" | "os" | "glass" | "blur";

export type ClassMap = Record<ClassKey, string>;
export type ThemeMap = Record<ThemeKey, Theme>;

export const tw = (classes: string) => classes;

export const themes: ThemeMap = {
    "basic-minimal": {
        classes: {
            TileOuter: tw("p-6"),
            TileOuterNoTopBar: tw("p-6"),
            Tile: tw(
                "h-full w-full bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col overflow-hidden p-5",
            ),
        },
    },
    retro: {
        classes: {
            TileOuter: tw(`
        relative pt-[26px] overflow-visible
        bg-[#c0c0c0]
        border-t-2 border-l-2 border-[#dfdfdf]
        border-b-2 border-r-2 border-[#808080]
        shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#000000]
        group
      `),
            TileOuterNoTopBar: tw(`
        relative overflow-visible
        bg-[#c0c0c0]
        border-t-2 border-l-2 border-[#dfdfdf]
        border-b-2 border-r-2 border-[#808080]
        shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#000000]
        group
      `),
            Tile: tw(`
        relative z-20 h-full w-full
        bg-white
        flex flex-col overflow-hidden p-3
        border-t-2 border-l-2 border-[#808080]
        border-b-2 border-r-2 border-[#dfdfdf]
        shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#000000]
      `),
        },
        TopBar: `
      <div class="absolute top-0 left-0 right-0 h-[26px] z-30 flex items-center justify-between px-1
                  bg-[#000080]
                  border-t-2 border-l-2 border-[#dfdfdf]
                  border-b-2 border-r-2 border-[#808080]
                  shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#000000]">
        <div class="flex items-center gap-1 flex-1 min-w-0">
          <div class="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center flex-shrink-0
                      shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#808080]">
            <div class="w-2 h-2 bg-[#000080]"></div>
          </div>
          <span class="text-white font-['MS_Sans_Serif',_'Arial',_sans-serif] text-sm font-bold truncate tracking-wide">
            {__TILE_TITLE__}
          </span>
        </div>
        <div class="flex gap-0.5 flex-shrink-0">
          <button class="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center
                         shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#808080]
                         active:shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080]
                         hover:bg-[#d4d4d4]">
            <span class="text-[8px] font-bold leading-none mb-0.5">−</span>
          </button>
          <button class="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center
                         shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#808080]
                         active:shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080]
                         hover:bg-[#d4d4d4]">
            <span class="text-[8px] font-bold leading-none">▲</span>
          </button>
        </div>
      </div>
    `,
    },
    "retro-mac": {
        classes: {
            TileOuter: tw(`
        relative pt-7 rounded-lg overflow-hidden p-2
        bg-gray-300
        shadow-[0_0_10px_rgba(0,0,0,0.3),0_4px_6px_-1px_rgba(0,0,0,0.5)]
        hover:shadow-[0_0_18px_rgba(0,0,0,0.45),0_10px_16px_-2px_rgba(0,0,0,0.6)]
        transition-all duration-200 isolate
      `),
            TileOuterNoTopBar: tw(`
        relative rounded-lg overflow-hidden p-2
        bg-gray-300
        shadow-[0_0_10px_rgba(0,0,0,0.3),0_4px_6px_-1px_rgba(0,0,0,0.5)]
        hover:shadow-[0_0_18px_rgba(0,0,0,0.45),0_10px_16px_-2px_rgba(0,0,0,0.6)]
        transition-all duration-200 isolate
      `),
            Tile: tw(
                "relative z-20 h-full w-full bg-white flex flex-col overflow-hidden p-5 shadow-md rounded-sm hover:w-[100.4%] hover:h-[100.4%] hover:-translate-[0.2%] transition-all duration-200",
            ),
        },
        extraHtml: `
        <div class="bg-[url('/images/themes/retro-mac/brushedmetal.png')] bg-repeat absolute inset-0 pointer-events-none opacity-40"></div>
        `,
        TopBar: `
        <div class="absolute top-0 left-0 right-0 h-7 flex items-center px-3 gap-2">


        <!-- Close button -->
        <div class="w-3.5 h-3.5 rounded-full
                    bg-linear-to-b from-red-300 via-red-500 to-red-700
                    border border-red-900/60
                    shadow-inner
                    relative hover:w-4 hover:h-4 transition-all duration-200 overflow-hidden">
            <div class="absolute top-px left-0.5 w-2 h-1 rounded-full bg-white/60 blur-[1px]"></div>
            <div class="absolute bottom-[0.5px] w-3 h-1 rounded-full bg-red-300/60 blur-[1px]"></div>
        </div>

        <!-- Minimise button -->
        <div class="w-3.5 h-3.5 rounded-full
                    bg-linear-to-b from-yellow-200 via-yellow-400 to-yellow-600
                    border border-yellow-900/60
                    shadow-inner
                    relative hover:w-4 hover:h-4 transition-all duration-200 overflow-hidden">
            <div class="absolute top-px left-0.5 w-2 h-1 rounded-full bg-white/60 blur-[1px]"></div>
            <div class="absolute bottom-[0.5px] w-3 h-1 rounded-full bg-yellow-200/60 blur-[1px]"></div>
        </div>

        <!-- Zoom button -->
        <div class="w-3.5 h-3.5 rounded-full
                    bg-linear-to-b from-green-300 via-green-500 to-green-700
                    border border-green-900/60
                    shadow-inner
                    relative hover:w-4 hover:h-4 transition-all duration-200 overflow-hidden">
            <div class="absolute top-px left-0.5 w-2 h-1 rounded-full bg-white/60 blur-[1px]"></div>
            <div class="absolute bottom-[0.5px] w-3 h-1 rounded-full bg-green-300/60 blur-[1px]"></div>
        </div>

        <!-- Optional toolbar title/content -->
        <div class="absolute left-1/2 top-1/2 -translate-1/2 flex-1 text-center text-xs font-semibold text-gray-700 select-none pointer-events-none font-mac">
            {__TILE_TITLE__}
        </div>
    `,
        Data: {},
    },
    os: {
        classes: {
            TileOuter: tw("relative pl-6 pr-6"),
            TileOuterNoTopBar: tw("relative pl-6 pr-6"),
            Tile: tw(`
        h-full w-full rounded-b-lg
        bg-white/80 backdrop-blur-2xl
        border border-gray-200/50
        shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]
        flex flex-col overflow-hidden p-6
        transition-all duration-300
        hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]
        hover:border-blue-200/60
      `),
        },
        TopBar: `
      <div class="absolute -top-10 left-6 right-6 h-10 z-30 flex items-center justify-between px-4
                  bg-white/60 backdrop-blur-xl
                  border border-gray-200/40
                  rounded-t-lg
                  shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <div class="w-2.5 h-2.5 bg-white/90 rounded-sm"></div>
          </div>
          <span class="text-sm font-normal text-gray-800 truncate tracking-tight">
            {__TILE_TITLE__}
          </span>
        </div>
        <div class="flex gap-3 items-center flex-shrink-0">
          <button class="w-11 h-7 rounded hover:bg-gray-200/70 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 16 16">
              <rect x="3" y="7" width="10" height="2" rx="1"/>
            </svg>
          </button>
          <button class="w-11 h-7 rounded hover:bg-gray-200/70 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
              <rect x="4" y="4" width="8" height="8" rx="0.5"/>
            </svg>
          </button>
          <button class="w-11 h-7 rounded hover:bg-red-500/10 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-gray-700 group-hover:text-red-600" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    `,
    },
    glass: {
        classes: {
            TileOuter: tw("relative pl-6 pr-6 hover:scale-[1.02] transition-all duration-300"),
            TileOuterNoTopBar: tw(
                "relative pl-6 pr-6 hover:scale-[1.02] transition-all duration-300",
            ),

            Tile: tw(`
        h-full w-full rounded-b-[20px]
        bg-white/20 backdrop-blur-3xl
        border border-white/30
        shadow-[0_8px_32px_rgba(31,38,135,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(255,255,255,0.5)_inset]
        flex flex-col overflow-hidden p-6
        transition-all duration-500
        hover:bg-white/25
        hover:shadow-[0_12px_48px_rgba(31,38,135,0.2),0_0_0_1px_rgba(255,255,255,0.15)_inset,0_2px_6px_rgba(255,255,255,0.6)_inset]
        hover:border-white/40
        relative
        before:absolute before:inset-0 before:rounded-[20px]
        before:bg-linear-to-br before:from-white/10 before:via-transparent before:to-transparent
        before:pointer-events-none
      `),
        },
        TopBar: `
      <div class="absolute -top-0 left-0 right-0 h-[52px] z-30 flex items-center justify-between px-5
                  bg-white/15 backdrop-blur-3xl
                  border border-white/20
                  rounded-t-[20px]
                  shadow-[0_4px_16px_rgba(31,38,135,0.1),0_0_0_1px_rgba(255,255,255,0.1)_inset]
                  transition-all duration-500
                  hover:bg-white/20
                  relative
                  before:absolute before:inset-0 before:rounded-t-[20px]
                  before:bg-gradient-to-b before:from-white/10 before:to-transparent
                  before:pointer-events-none">
        <div class="flex items-center gap-3 flex-1 min-w-0 relative z-10">
          <div class="w-6 h-6 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-blue-400/40 to-purple-500/40
                      backdrop-blur-sm
                      border border-white/30
                      shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.2)_inset]">
            <div class="w-3 h-3 bg-white/80 rounded-full shadow-inner"></div>
          </div>
          <span class="text-sm font-medium text-gray-800/90 truncate tracking-tight drop-shadow-sm">
            {__TILE_TITLE__}
          </span>
        </div>
        <div class="flex gap-2 items-center flex-shrink-0 relative z-10">
          <button class="w-9 h-9 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group border border-transparent hover:border-white/20">
            <svg class="w-3.5 h-3.5 text-gray-700/80 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 16 16">
              <rect x="3" y="7" width="10" height="2" rx="1"/>
            </svg>
          </button>
          <button class="w-9 h-9 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group border border-transparent hover:border-white/20">
            <svg class="w-3.5 h-3.5 text-gray-700/80 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
              <rect x="4.5" y="4.5" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <button class="w-9 h-9 rounded-full hover:bg-red-500/15 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group border border-transparent hover:border-red-400/30">
            <svg class="w-3.5 h-3.5 text-gray-700/80 group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    `,
    },
    blur: {
        classes: {
            TileOuter: tw("relative pl-6 pr-6"),
            TileOuterNoTopBar: tw("relative pl-6 pr-6"),
            Tile: tw(`
        h-full w-full rounded-b-2xl
        bg-neutral-900/50 backdrop-blur-2xl
        border border-white/5
        shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset]
        flex flex-col overflow-hidden text-white p-6
        transition-all duration-300
        hover:bg-neutral-900/60
        hover:border-white/10
        hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset]
      `),
        },
        TopBar: `
      <div class="absolute -top-12 left-6 right-6 h-12 z-30 flex items-center justify-between px-4
                  bg-neutral-800/40 backdrop-blur-2xl
                  border border-white/5
                  rounded-t-2xl
                  shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                  transition-all duration-300
                  hover:bg-neutral-800/50">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-5 h-5 rounded-md flex items-center justify-center
                      bg-gradient-to-br from-neutral-700/60 to-neutral-800/60
                      border border-white/10
                      shadow-inner">
            <div class="w-2.5 h-2.5 bg-neutral-400/80 rounded-sm"></div>
          </div>
          <span class="text-sm font-normal text-neutral-200 truncate tracking-tight">
            {__TILE_TITLE__}
          </span>
        </div>
        <div class="flex gap-2 items-center flex-shrink-0">
          <button class="w-8 h-8 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-neutral-400 group-hover:text-neutral-200" fill="currentColor" viewBox="0 0 16 16">
              <rect x="3" y="7" width="10" height="2" rx="1"/>
            </svg>
          </button>
          <button class="w-8 h-8 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-neutral-400 group-hover:text-neutral-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
              <rect x="4" y="4" width="8" height="8" rx="0.5"/>
            </svg>
          </button>
          <button class="w-8 h-8 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center group">
            <svg class="w-3 h-3 text-neutral-400 group-hover:text-red-400" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    `,
    },
};

const DEFAULT_THEME = "retro-mac";

export const defaultClasses: ClassMap = themes[DEFAULT_THEME].classes;
export const defaultTopBar: string = themes[DEFAULT_THEME].TopBar || "";
export const defaultExtraHtml: string = themes[DEFAULT_THEME].extraHtml || "";
