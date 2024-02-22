import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Feed, get_related_feeds } from '@/apis/feed'
import MoreLoading from '@/components/more-loading'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useInfinity } from '@youknown/react-hook/src'
import { Image, List } from '@youknown/react-ui/src'
import { QS } from '@youknown/utils/src'

interface RelatedAreaProps {
	feed: Feed
}
export default function RelatedArea(props: RelatedAreaProps) {
	const { feed } = props

	const navigate = useTransitionNavigate()
	const { t } = useTranslation()

	const go_feed_detail = (feed_info: Feed) => {
		navigate(
			QS.stringify({
				base: '/browse/feed-detail',
				query: {
					feed_id: feed_info.id
				}
			}),
			{ state: feed_info }
		)
	}

	const container_ref = useRef<HTMLDivElement>(null)
	const loading_ref = useRef<HTMLDivElement>(null)
	const [feeds_total, set_feeds_total] = useState(0)
	const fetcher = async () => {
		const { list, total } = await get_related_feeds({
			space_id: feed.subject.space_id,
			page,
			page_size
		})
		set_feeds_total(total)
		return list
	}
	const {
		data: feeds,
		noMore: no_more,
		page,
		pageSize: page_size
	} = useInfinity(fetcher, {
		target: loading_ref,
		observerInit: {
			root: container_ref.current
		}
	})

	return (
		<div className="max-w-100% sm:w-720px sm:ml-auto sm:mr-auto <sm:pl-16px <sm:pr-16px mt-32px mb-32px">
			<div className="font-700 text-18px mb-24px">
				{feeds_total} {t('related.feed_count')}
			</div>

			<List className="max-h-224px overflow-y-auto " ref={container_ref}>
				{feeds.map(feed_info => {
					const { subject } = feed_info
					return (
						<List.Item
							key={subject.doc_id}
							prefix={<Image className="w-40px h-32px rd-radius-m" src={subject.cover} />}
							className="active-bg-active [@media(hover:hover)]-hover-not-active-bg-hover cursor-pointer"
							onClick={() => go_feed_detail(feed_info)}
						>
							<div className="truncate">{subject.title}</div>
						</List.Item>
					)
				})}
				{no_more || <MoreLoading ref={loading_ref} />}
			</List>
		</div>
	)
}