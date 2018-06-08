/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

package com.sun.webui.jsf.renderkit.html;

import java.io.IOException;
import java.util.List;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.Renderer;
import com.sun.webui.html.HTMLAttributes;
import com.sun.webui.html.HTMLElements;
import com.sun.webui.jsf.component.Property;
import com.sun.webui.theme.Theme;
import com.sun.webui.jsf.theme.ThemeStyles;
import com.sun.webui.jsf.util.RenderingUtilities;
import com.sun.webui.jsf.util.ThemeUtilities;

/**
 * <p>Renders a version page.</p>
 */
@com.sun.faces.annotation.Renderer(@com.sun.faces.annotation.Renderer.Renders(componentFamily = "com.sun.webui.jsf.Property"))
public class PropertyRenderer extends Renderer {

    /**
     * Creates a new instance of PropertyRenderer.
     */
    public PropertyRenderer() {
    }

    /**
     * This renderer renders the component's children.
     */
    @Override
    public boolean getRendersChildren() {
        return true;
    }

    /**
     * Render a property component.
     * 
     * @param context The current FacesContext
     * @param component The Property object to render
     *
     * @exception IOException if an input/output error occurs
     */
    @Override
    public void encodeEnd(FacesContext context, UIComponent component)
            throws IOException {

        if (context == null || component == null) {
            throw new NullPointerException();
        }

        if (!component.isRendered()) {
            return;
        }

        ResponseWriter writer = context.getResponseWriter();
        Property property = (Property) component;

        // Get the theme
        //
        Theme theme = ThemeUtilities.getTheme(context);

        // Ideally the PropertyRenderer shouldn't have to know
        // what it is contained by. But this implementation assumes
        // that a table has been used as the container and therefore
        // the responsibility for rendering rows and cells
        // is left to the PropertyRenderer. This is where a
        // LayoutComponent could be useful. The PropertyLayoutComponent
        // knows that a Property consists of a Label and some other
        // components and lays it out accordingly.
        //
        writer.startElement(HTMLElements.TR, property);
        writer.writeAttribute(HTMLAttributes.ID, property.getClientId(context),
                null);

        // Its not clear if the developer realizes that the styleClass
        // and style attributes are applied to a "tr".
        //
        String propValue = RenderingUtilities.getStyleClasses(context,
                component, null);
        if (propValue != null) {
            writer.writeAttribute(HTMLAttributes.CLASS, propValue, null);
        }

        propValue = property.getStyle();
        if (propValue != null) {
            writer.writeAttribute(HTMLAttributes.STYLE, propValue,
                    HTMLAttributes.STYLE);
        }

        writer.startElement(HTMLElements.TD, property);
        writer.writeAttribute(HTMLAttributes.VALIGN, "top", null);//NOI18N

        // Always render the nowrap, and labelAlign even if there
        // isn't a label.
        //
        boolean nowrap = property.isNoWrap();
        if (nowrap) {
            writer.writeAttribute(HTMLAttributes.NOWRAP, "nowrap", null); //NOI18N
        }
        String labelAlign = property.getLabelAlign();
        if (labelAlign != null) {
            writer.writeAttribute(HTMLAttributes.ALIGN, labelAlign, null);
        }

        // If overlapLabel is true, then render the TD with colspan 2.
        // and the property components share the div.
        // If overlapLabel is false then render two TD's and two DIV's
        //
        boolean overlapLabel = property.isOverlapLabel();
        if (overlapLabel) {
            writer.writeAttribute(HTMLAttributes.COLSPAN, "2", null);//NOI18N
        }

        writer.startElement(HTMLElements.DIV, property);
        writer.writeAttribute(HTMLAttributes.CLASS,
                theme.getStyleClass(ThemeStyles.CONTENT_TABLE_COL1_DIV), null);

        renderLabel(context, property, theme, writer);


        // If overlapLabel is false, close the label TD and DIV
        // and open another TD and DIV for the property components.
        //
        if (!overlapLabel) {
            writer.endElement(HTMLElements.DIV);
            writer.endElement(HTMLElements.TD);
            writer.startElement(HTMLElements.TD, property);
            writer.startElement(HTMLElements.DIV, property);
            writer.writeAttribute(HTMLAttributes.CLASS,
                    theme.getStyleClass(ThemeStyles.CONTENT_TABLE_COL2_DIV), null);
        }

        renderPropertyComponents(context, property, theme, writer);
        renderHelpText(context, property, theme, writer);

        writer.endElement(HTMLElements.DIV);
        writer.endElement(HTMLElements.TD);
        writer.endElement(HTMLElements.TR);
    }

    /**
     * Render the property components.
     * If the <code>content</code> facet it defined it takes precendence
     * over the existence of child components. If there is not
     * <code>content</code> facet, then the children are rendered.
     * 
     * @param context The current FacesContext
     * @param property The Property object to render
     * @param theme The Theme to reference.
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurs
     */
    protected void renderPropertyComponents(FacesContext context,
            Property property, Theme theme,
            ResponseWriter writer) throws IOException {

        // The presence of a content facet takes priority over
        // children. I'm not sure why there is both a content facet
        // and children.
        //
        UIComponent content = property.getContentComponent();
        if (content != null) {
            RenderingUtilities.renderComponent(content, context);
            return;
        }

        // If there isn't a content facet, render any children.
        //
        List children = property.getChildren();
        for (Object child : children) {
            RenderingUtilities.renderComponent((UIComponent) child, context);
        }
    }

    /**
     * Render a label for the property
     * 
     * @param context The current FacesContext
     * @param property The Property object to render
     * @param theme The Theme to reference.
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurs
     */
    protected void renderLabel(FacesContext context,
            Property property, Theme theme,
            ResponseWriter writer) throws IOException {

        // Render a label facet if there is one, else a span
        // and "&nbsp".
        //
        UIComponent label = property.getLabelComponent();
        if (label != null) {
            RenderingUtilities.renderComponent(label, context);
            return;
        }

        writer.startElement(HTMLElements.SPAN, property);

        // The class selector should be minimally themeable.
        // Not sure why we even need it for "nbsp".
        // Other components offer a labelLevel attribute as well.
        //
        writer.writeAttribute(HTMLAttributes.CLASS,
                theme.getStyleClass(ThemeStyles.LABEL_LEVEL_TWO_TEXT), null);
        writer.write("&nbsp;"); // NOI18N
        writer.endElement(HTMLElements.SPAN);
    }

    /**
     * Render help text for the property
     * 
     * @param context The current FacesContext
     * @param property The Property object to render
     * @param theme The Theme to reference.
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurs
     */
    protected void renderHelpText(FacesContext context,
            Property property, Theme theme,
            ResponseWriter writer) throws IOException {

        // Render a help text facet if there is one
        //
        UIComponent helpText = property.getHelpTextComponent();
        if (helpText != null) {
            RenderingUtilities.renderComponent(helpText, context);
        }
    }

    /**
     * Does nothing.
     * 
     * @param context The current FacesContext
     * @param component The Property object to render
     *
     * @exception IOException if an input/output error occurs
     */
    @Override
    public void encodeChildren(FacesContext context, UIComponent component)
            throws IOException {
        if (context == null || component == null) {
            throw new NullPointerException();
        }
    }
}
