import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface QuoteRequestReceivedEmailProps {
	orderNumber: string;
	customerName?: string;
	serviceName: string;
	trackingUrl: string;
	contactEmail: string;
	contactPhone?: string;
}

export const QuoteRequestReceivedEmail = ({
	orderNumber,
	customerName = 'there',
	serviceName,
	trackingUrl,
	contactEmail,
	contactPhone,
}: QuoteRequestReceivedEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{`Your quote request has been received! Order: ${orderNumber}`}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={headerText}>Request Received</Heading>
					</Section>

					<Section style={content}>
						<Text style={paragraph}>Hi {customerName},</Text>

						<Text style={paragraph}>
							Thank you for choosing Tasheel! We've received your quote request and our team will review
							it shortly.
						</Text>

						<Section style={orderBox}>
							<Text style={orderLabel}>Order Number:</Text>
							<Text style={orderValue}>{orderNumber}</Text>

							<Text style={orderLabel}>Service:</Text>
							<Text style={orderValue}>{serviceName}</Text>
						</Section>

						<Text style={paragraph}>
							<strong>What happens next?</strong>
						</Text>
						<ol style={listStyle}>
							<li>Our team will review your request within 2 hours</li>
							<li>We'll contact you via phone or email with a detailed quote</li>
							<li>Once approved, we'll begin processing your order</li>
						</ol>

						<Section style={buttonContainer}>
							<Button style={button} href={trackingUrl}>
								Track Your Order
							</Button>
						</Section>

						<Text style={footerText}>
							<strong>Need help?</strong>
							<br />
							Email: <Link href={`mailto:${contactEmail}`} style={link}>{contactEmail}</Link>
							{contactPhone && (
								<>
									<br />
									Phone: {contactPhone}
								</>
							)}
						</Text>
					</Section>

					<Section style={footer}>
						<Text style={footerText}>
							© {new Date().getFullYear()} Tasheel. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default QuoteRequestReceivedEmail;

// Styles
const main = {
	backgroundColor: '#f5f5f5',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	padding: '40px 20px',
};

const container = {
	backgroundColor: '#ffffff',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
	margin: '0 auto',
	maxWidth: '600px',
	overflow: 'hidden',
};

const header = {
	backgroundColor: 'rgba(14, 33, 160, 1)',
	padding: '30px 40px',
	textAlign: 'center' as const,
};

const headerText = {
	color: '#ffffff',
	fontSize: '24px',
	fontWeight: '600',
	margin: '0',
};

const content = {
	padding: '40px',
};

const paragraph = {
	fontSize: '16px',
	lineHeight: '1.5',
	color: '#333',
	margin: '0 0 20px',
};

const orderBox = {
	backgroundColor: '#f9f9f9',
	borderRadius: '6px',
	margin: '30px 0',
	padding: '20px',
};

const orderLabel = {
	color: '#666',
	fontSize: '14px',
	margin: '8px 0 4px',
};

const orderValue = {
	color: '#333',
	fontSize: '14px',
	fontWeight: '600',
	textAlign: 'right' as const,
	margin: '4px 0 8px',
};

const listStyle = {
	paddingLeft: '20px',
	margin: '20px 0',
	fontSize: '16px',
	lineHeight: '1.8',
	color: '#333',
};

const buttonContainer = {
	margin: '30px 0',
	textAlign: 'center' as const,
};

const button = {
	backgroundColor: 'rgba(14, 33, 160, 1)',
	borderRadius: '6px',
	color: '#ffffff',
	display: 'inline-block',
	fontSize: '16px',
	fontWeight: '600',
	padding: '14px 32px',
	textDecoration: 'none',
};

const link = {
	color: 'rgba(14, 33, 160, 1)',
	textDecoration: 'none',
};

const footerText = {
	fontSize: '14px',
	color: '#666',
	margin: '0',
	lineHeight: '1.5',
};

const footer = {
	backgroundColor: '#f9f9f9',
	borderTop: '1px solid #e0e0e0',
	padding: '30px 40px',
	textAlign: 'center' as const,
};

