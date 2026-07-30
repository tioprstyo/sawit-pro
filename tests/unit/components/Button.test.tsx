import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../src/components/atoms';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should render with children content', () => {
      render(
        <Button>
          <span>Content</span>
        </Button>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant class', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('.primary');

      expect(button).toBeInTheDocument();
    });

    it('should apply danger variant class', () => {
      const { container } = render(<Button variant="danger">Delete</Button>);
      const button = container.querySelector('.danger');

      expect(button).toBeInTheDocument();
    });

    it('should apply success variant class', () => {
      const { container } = render(<Button variant="success">Save</Button>);
      const button = container.querySelector('.success');

      expect(button).toBeInTheDocument();
    });

    it('should default to primary variant', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('.primary');

      expect(button).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply sm size class', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector('.sm');

      expect(button).toBeInTheDocument();
    });

    it('should apply lg size class', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector('.lg');

      expect(button).toBeInTheDocument();
    });

    it('should default to md size', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('.md');

      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button', { name: /click/i });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>
      );

      const button = screen.getByRole('button', { name: /click/i });
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(
        <Button aria-label="Save changes">Save</Button>
      );

      const button = container.querySelector('[aria-label="Save changes"]');
      expect(button).toBeInTheDocument();
    });

    it('should be focusable', () => {
      render(<Button>Focus me</Button>);

      const button = screen.getByRole('button', { name: /focus me/i });
      button.focus();

      expect(document.activeElement).toBe(button);
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', () => {
      render(
        <Button data-testid="custom-button" type="submit">
          Submit
        </Button>
      );

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support custom className', () => {
      const { container } = render(
        <Button className="custom-class">Button</Button>
      );

      const button = container.querySelector('.custom-class');
      expect(button).toBeInTheDocument();
    });
  });
});
