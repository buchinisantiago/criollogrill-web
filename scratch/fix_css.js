const fs = require('fs');

const bannerCSS = `
/* Trust Banner */
.trust-banner {
  background: #111116; 
  padding: 2.5rem 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.trust-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}
.trust-text {
  flex: 1;
  min-width: 300px;
}
.trust-text h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 300;
  font-family: var(--font-body);
}
.trust-text p {
  color: rgba(255,255,255,0.8);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
}
.trust-ratings {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}
.trust-rating-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.trust-rating-item .stars {
  display: flex;
  gap: 4px;
}
.trust-rating-item .stars svg {
  fill: #ffffff;
  width: 22px;
  height: 22px;
}
.trust-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}
@media (max-width: 768px) {
  .trust-container {
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
  }
}
`;

fs.appendFileSync('css/styles.css', '\n' + bannerCSS + '\n');
