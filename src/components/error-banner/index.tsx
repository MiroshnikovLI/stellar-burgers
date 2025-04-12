import React from 'react';
import { ErrorBannerUI } from '../ui/error-banner';

interface ErrorBannerProps {
  initialMounted: boolean;
  error: string;
  autoCloseDelay?: number; // Настройки задержки
}

interface ErrorBannerState {
  isVisible: boolean;
  error: string;
}

export class ErrorBanner extends React.Component<
  ErrorBannerProps,
  ErrorBannerState
> {
  private timerId?: NodeJS.Timeout; // Для очистки таймера

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(props: ErrorBannerProps) {
    super(props);

    this.state = {
      isVisible: props.initialMounted,
      error: props.error
    };

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.startAutoCloseTimer();
  }

  componentDidUpdate(prevProps: ErrorBannerProps) {
    if (this.props.error !== prevProps.error) {
      // Сброс состояния при новом error
      this.setState({ isVisible: true, error: this.props.error });
      this.startAutoCloseTimer();
    }
  }

  componentWillUnmount() {
    this.clearTimer(); // Очистить таймер
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private startAutoCloseTimer() {
    this.clearTimer(); // Очищаем предыдущий таймер
    this.timerId = setTimeout(
      () => this.close(),
      this.props.autoCloseDelay || 3000
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  close() {
    this.clearTimer();
    this.setState({ isVisible: false, error: '' });
  }

  render() {
    const { isVisible, error } = this.state;

    return isVisible ? (
      <ErrorBannerUI error={error} onClose={this.close} />
    ) : null;
  }
}
