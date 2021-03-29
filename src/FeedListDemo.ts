import { Group, vlayout, layoutConfig, HLayout, LayoutSpec, Gravity, text, Text, Color, navbar, ViewModel, ViewHolder, VMPanel, list, listItem, List, hlayout, image, ScaleType, stack, Image, VLayout, navigator } from "doric";
import Timeline from './timeline.json'
import {PhotoBrowserDemo} from './PhotoBrowserDemo'
import {sudukouMarginLeft, sudukouMarginRight, feedMargin, sudukouGap} from './utils'


type DisplayImageInfo = {
    imageW: number
    imageH: number
    scaleType: ScaleType
}

interface TimelineImageInfo {
    imageUrl: string,
    imgHeight: number,
    imgWidth: number
}

interface TimelineModel {
    code: string,
    msg: string,
    result: Array<{
        age: number,
        avatar: string,
        avatarFrame?: string,
        gender: number,
        imageList?: Array<TimelineImageInfo>,
        nickname: string,
        textContent?: string,
        isExpanded?: boolean
    }>
}

class FeedListModel {
    timeline: TimelineModel
    darkModel: Boolean

    constructor(timeline: TimelineModel, darkModel: Boolean, end: Boolean) {
        this.timeline = timeline
        this.darkModel = darkModel
        this.timeline.result.map(info => info.isExpanded = false)
    }
}

class FeedListView extends ViewHolder {
    listView!: List
    rightTextView!: Text

    sudukouWidth = Environment.screenWidth - sudukouMarginLeft - sudukouMarginRight - feedMargin
    // 以三张图片占满屏幕
    baseImageWidth = (this.sudukouWidth - 2 * sudukouGap) / 3.0
    // 以两张图片占满屏幕
    baseImageWidthFor2And4 = (this.sudukouWidth - sudukouGap) / 2.0

    build(root: Group) {
        navbar(context).setRight(text({
            text: "黑夜"
        }).also(it => this.rightTextView = it))

        list({
            layoutConfig: layoutConfig().most()
        }).also(it => this.listView = it).in(root)
    }

    getImageDisplayInfo(imageInfo: TimelineImageInfo, count: number): DisplayImageInfo {
        const scale = imageInfo.imgWidth * 1.0 / imageInfo.imgHeight
        let imageW = 0
        let imageH = 0
        let scaleType = ScaleType.ScaleAspectFill
        if (count === 1) {
            if (scale <= 3 / 4.0) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW / (3 / 4.0)
                scaleType = ScaleType.ScaleAspectFill
            } else if (scale < 1) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW / scale
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale === 1) {
                imageW = 2 * this.baseImageWidth + sudukouGap
                imageH = imageW
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale < 16 / 9.0) {
                imageH = 1.7 * this.baseImageWidth + sudukouGap
                imageW = scale * imageH
                scaleType = ScaleType.ScaleAspectFit
            } else if (scale <= 2) {
                imageW = this.sudukouWidth
                imageH = imageW / scale
                scaleType = ScaleType.ScaleAspectFit
            } else {
                imageH = 1.5 * this.baseImageWidth + sudukouGap
                imageW = this.sudukouWidth
                scaleType = ScaleType.ScaleAspectFill
            }
        } else if (count === 2 || count === 4) {
            imageW = this.baseImageWidthFor2And4
            imageH = imageW
            scaleType = ScaleType.ScaleAspectFill
        } else {
            imageW = this.baseImageWidth
            imageH = this.baseImageWidth
            scaleType = ScaleType.ScaleAspectFill
        }
        return {
            imageH,
            imageW,
            scaleType
        }
    }
        
    getImageSudokuFlowLayout(config: Partial<HLayout>, imageList: Array<TimelineImageInfo>): HLayout {
        const count = imageList.length
        if (count === 0) {
            return vlayout([], {})
        } 

        let columnCount = 0
        if (count === 1) {
            columnCount = 1
        } else if (count === 2 || count === 4) {
            columnCount = 2
        } else {
            columnCount = 3
        }

        const elements = new Array<Array<Image>>()
        for (let index = 0; index < columnCount; index++) {
            elements.push(Array<Image>())
        }

        imageList.forEach((val, index) => {
            const displayInfo = this.getImageDisplayInfo(val, count)
            let element = elements[index % columnCount];
            element.push(
                image({
                    imageUrl: imageList[index].imageUrl,
                    layoutConfig: layoutConfig().just(),
                    width: displayInfo.imageW,
                    height: displayInfo.imageH,
                    scaleType: displayInfo.scaleType,

                    onClick: () => {
                        navigator(context).push(PhotoBrowserDemo, {
                            animated: true,
                            extra: {
                                current: index,
                                source: imageList
                            }
                        })
                    }
                })
            )
        })

        let children: VLayout[] = []
        elements.forEach(ele => {
            children.push(
                vlayout(ele, {
                    space: count === 1 ? 0 : sudukouGap
                })
            )
        })

        const sudukou = hlayout(children, config)
        sudukou.space = count === 1 ? 0 : sudukouGap

        return sudukou        
    }

    switchDarkMode = (isDark: Boolean) => {
        this.rightTextView.text = isDark ? "白天" : "黑夜"
        this.rightTextView.textColor = isDark ? Color.WHITE : Color.BLACK
        this.listView.backgroundColor = isDark ? Color.BLACK : Color.WHITE
        navbar(context).setBgColor(isDark ? Color.BLACK : Color.WHITE)
    } 

    bind(s: FeedListModel) {

        // 白天黑夜模式
        this.switchDarkMode(s.darkModel)
        this.listView.also(it => {
            it.itemCount = s.timeline.result.length
            it.renderItem = (index) => listItem(
                vlayout([
                    hlayout([
                        stack([
                            image({
                                imageUrl: s.timeline.result[index].avatar || '',
                                layoutConfig: layoutConfig().just(),
                                width: 40,
                                height: 40,
                                scaleType: ScaleType.ScaleAspectFit,
                                corners: 20,
                                top: 12,
                                left: 12
                            }),
                            image({
                                imageUrl: s.timeline.result[index].avatarFrame || '',
                                layoutConfig: layoutConfig().just(),
                                width: 64,
                                height: 64,
                                scaleType: ScaleType.ScaleAspectFit
                            })
                        ], {
                            layoutConfig: layoutConfig().most().configWidth(LayoutSpec.JUST),
                            width: 64
                        }),
                        text({
                            text: s.timeline.result[index].nickname || '',
                            textColor: s.darkModel ? Color.WHITE : Color.parse("#111111"),
                            textSize: 16
                        }),
                        text({
                            text: s.timeline.result[index].age.toString(),
                            layoutConfig: layoutConfig().just(),
                            left: 10,
                            width: 30,
                            height: 14,
                            textSize: 10,
                            corners: 7,
                            backgroundColor: s.timeline.result[index].gender === 1 ? Color.parse("#EEEEEE") : Color.parse('#FFEDF2'),
                            textColor: s.timeline.result[index].gender === 1 ? Color.parse("#999999") : Color.parse('#FF6E94'),
                        })
                    ], {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                        height: 64,
                        gravity: Gravity.CenterY
                    }),

                    vlayout([
                        (s.timeline.result[index].textContent || '').length > 0 ? text({
                            text: s.timeline.result[index].textContent!,
                            textColor: s.darkModel ? Color.WHITE : Color.parse("#111111"),
                            textSize: 16,
                            maxLines: s.timeline.result[index].isExpanded ? 0 : 3,
                            textAlignment: Gravity.Left,
                            padding: {
                                bottom: 10
                            },
                        }) : text({text: '', 
                            layoutConfig: layoutConfig().just(),
                            height: 0,
                            padding: {
                                bottom: 0,
                            }
                        }),

                        // mock
                        (s.timeline.result[index].textContent || '').length >= 80 ? text({
                            text: s.timeline.result[index].isExpanded ? '收起' : '展开',
                            textSize: 14,
                            textAlignment: Gravity.Left,
                            textColor: Color.parse('#8854FF'),
                            padding: {
                                bottom: 10
                            },
                            onClick: () => {
                                s.timeline.result[index].isExpanded = !s.timeline.result[index].isExpanded
                                this.bind(s)
                            }
                        }) : text({
                            text: '',
                            layoutConfig: layoutConfig().just(),
                            height: 0,
                            padding: {
                                bottom: 0
                            },
                        })
                    ], {
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.FIT),
                        left: sudukouMarginLeft
                    }),

                    this.getImageSudokuFlowLayout({
                        left: sudukouMarginLeft,
                        corners: 16,
                    }, s.timeline.result[index].imageList || [])
                ], {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    padding: {
                        left: feedMargin,
                        right: sudukouMarginRight,
                        top: feedMargin,
                        bottom: feedMargin
                    }
                })
            , {
                layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            })
        })
    }
}

class FeedListVM extends ViewModel<FeedListModel, FeedListView> {
    onAttached(s: FeedListModel, vh: FeedListView) {
        vh.rightTextView.onClick = () => {
            this.updateState((state) => {
                state.darkModel = !state.darkModel
            })
        }
    }

    onBind(s: FeedListModel, vh: FeedListView) {
        vh.bind(s)
    }
}

@Entry
export class FeedListDemo extends VMPanel<FeedListModel, FeedListView> {
    getViewHolderClass() {
        return FeedListView
    }

    getViewModelClass() {
        return FeedListVM
    }

    getState(): FeedListModel {
        return new FeedListModel(Timeline, false, false)
    }

    onShow() {
        
    }

    onCreate() {
        navbar(context).setTitle("Feed List")
    }
}