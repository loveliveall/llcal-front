import React from 'react';

import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';

import SingleEvent from './SingleEvent';
import WeekEventSingleRow from './WeekEventSingleRow';
import { EventInstanceDiv, EventTextTypo } from './styles';
import { TMonthEventGrid, ICalendarEvent, ISingleEventRenderInfo } from '../utils/types';

const Root = styled('div')`
  overflow: hidden;
  width: 100%;
  z-index: 0;
`;
const MoreRow = styled('div')`
  display: flex;
  width: 100%;
`;
const SingleSlot = styled('div')`
  width: ${100 / 7}%;
`;
const PaddedDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

interface IOwnProps {
  isMobile: boolean,
  dayStartHour: number,
  eventRenderGrid: TMonthEventGrid,
  onEventClick: (event: ICalendarEvent) => void,
}
type WeekEventRowProps = IOwnProps;

const WeekEventRow: React.FC<WeekEventRowProps> = ({
  isMobile, dayStartHour, eventRenderGrid, onEventClick,
}) => {
  const [morePopup, setMorePopup] = React.useState<{
    anchorEl: HTMLDivElement | null,
    eventGrid: ISingleEventRenderInfo[],
  }>({
    anchorEl: null,
    eventGrid: [],
  });
  // Async setState does not be batched. Merge into one state for batch updating
  const [heightInfo, setHeightInfo] = React.useState({
    offset: 0,
    item: 0, // This value will be calculated on overflow
  });
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    setHeightInfo({
      offset: 0,
      item: 0,
    });
    const resizeHandler = () => {
      // Clear previous timeout
      clearTimeout(timeoutId);
      // Add new timeout that fires state mutation
      timeoutId = setTimeout(() => {
        const cur = ref.current;
        if (cur === null) {
          setHeightInfo({
            offset: 0,
            item: 0,
          });
        } else {
          const { offsetHeight, scrollHeight } = cur;
          const rowCount = eventRenderGrid.length;
          const itemHeight = rowCount !== 0 && offsetHeight < scrollHeight ? scrollHeight / rowCount : 0;
          setHeightInfo((prev) => ({
            offset: offsetHeight,
            item: prev.item === 0 ? itemHeight : prev.item,
          }));
        }
      }, 150);
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isMobile, eventRenderGrid.length]);
  const sliceRowAt = (() => {
    const { offset, item } = heightInfo;
    if (item === 0) return -1;
    const visibleCount = Math.floor(offset / item);
    const totalRow = eventRenderGrid.length;
    return visibleCount >= totalRow ? totalRow : Math.max(visibleCount - 1, 0);
  })();
  return (
    <Root ref={ref}>
      {(sliceRowAt === -1 ? eventRenderGrid : eventRenderGrid.slice(0, sliceRowAt)).map((row, idx) => (
        <WeekEventSingleRow
          key={idx} // eslint-disable-line react/no-array-index-key
          isMobile={isMobile}
          dayStartHour={dayStartHour}
          row={row}
          onEventClick={onEventClick}
        />
      ))}
      {/* `more` button */}
      <MoreRow>
        {sliceRowAt !== -1 && new Array(7).fill(null).map((_, idx) => {
          const reactKey = `button-wrapper-${idx}`;
          const invisibleCount = eventRenderGrid.slice(sliceRowAt).reduce(
            (acc, curr) => acc + (curr[idx] !== null ? 1 : 0), 0,
          );
          if (invisibleCount === 0) return <div key={reactKey} style={{ width: `${100 / 7}%` }} />;
          const openMorePopup = (anchor: HTMLDivElement) => {
            const thisDayEvents = eventRenderGrid.map((r) => r[idx]).filter(
              (i): i is ISingleEventRenderInfo => i !== null,
            );
            setMorePopup({
              anchorEl: anchor,
              eventGrid: thisDayEvents,
            });
          };
          const onMoreClick = (event: React.MouseEvent<HTMLDivElement>) => {
            openMorePopup(event.currentTarget);
          };
          const onMoreKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
              openMorePopup(event.currentTarget);
            }
          };
          return (
            <SingleSlot key={reactKey}>
              <EventInstanceDiv
                role="button"
                tabIndex={0}
                onClick={onMoreClick}
                onKeyUp={onMoreKeyUp}
              >
                <EventTextTypo
                  variant="body2"
                >
                  {`+${invisibleCount} more`}
                </EventTextTypo>
              </EventInstanceDiv>
            </SingleSlot>
          );
        })}
      </MoreRow>
      {/* `more` popover */}
      <Popover
        open={morePopup.anchorEl !== null}
        anchorEl={morePopup.anchorEl}
        onClose={() => setMorePopup((prev) => ({
          anchorEl: null,
          eventGrid: prev.eventGrid,
        }))}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        sx={{
          width: '20%',
        }}
      >
        <PaddedDiv>
          {morePopup.eventGrid.map((instance) => {
            const { event } = instance;
            const onInstanceClick = (e: ICalendarEvent) => {
              setMorePopup((prev) => ({
                anchorEl: null,
                eventGrid: prev.eventGrid,
              }));
              onEventClick(e);
            };
            return (
              <SingleEvent
                key={instance.event.id}
                isMobile={isMobile}
                dayStartHour={dayStartHour}
                event={event}
                isBlock={instance.isBlock}
                onEventClick={onInstanceClick}
              />
            );
          })}
        </PaddedDiv>
      </Popover>
    </Root>
  );
};

export default WeekEventRow;
